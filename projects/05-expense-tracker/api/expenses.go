package handler

import (
	"encoding/json"
	"math"
	"net/http"
	"sort"
	"strconv"
	"sync"
	"time"
)

type Expense struct {
	ID       string  `json:"id"`
	Label    string  `json:"label"`
	Amount   float64 `json:"amount"`
	Category string  `json:"category"`
}

type CategoryStat struct {
	Category string  `json:"category"`
	Amount   float64 `json:"amount"`
	Pct      float64 `json:"pct"`
}

type Response struct {
	Expenses   []Expense      `json:"expenses"`
	Total      float64        `json:"total"`
	Categories []CategoryStat `json:"categories"`
}

var (
	mu       sync.Mutex
	expenses = []Expense{
		{ID: "1", Label: "Groceries", Amount: 64.2, Category: "Food"},
		{ID: "2", Label: "Bus pass", Amount: 45, Category: "Transport"},
		{ID: "3", Label: "Netflix", Amount: 15.99, Category: "Subscriptions"},
	}
)

func round2(v float64) float64 {
	return math.Round(v*100) / 100
}

func withStats() Response {
	total := 0.0
	byCat := map[string]float64{}
	var order []string
	for _, e := range expenses {
		total += e.Amount
		if _, seen := byCat[e.Category]; !seen {
			order = append(order, e.Category)
		}
		byCat[e.Category] += e.Amount
	}

	cats := make([]CategoryStat, 0, len(order))
	for _, cat := range order {
		amt := byCat[cat]
		pct := 0.0
		if total > 0 {
			pct = math.Round((amt/total)*1000) / 10
		}
		cats = append(cats, CategoryStat{Category: cat, Amount: round2(amt), Pct: pct})
	}
	sort.Slice(cats, func(i, j int) bool { return cats[i].Amount > cats[j].Amount })

	return Response{Expenses: expenses, Total: round2(total), Categories: cats}
}

func writeJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}

// Handler is the Vercel Go serverless entrypoint for /api/expenses.
func Handler(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	switch r.Method {
	case http.MethodGet:
		writeJSON(w, http.StatusOK, withStats())

	case http.MethodPost:
		var body struct {
			Label    string `json:"label"`
			Amount   string `json:"amount"`
			Category string `json:"category"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON body"})
			return
		}

		amount, err := strconv.ParseFloat(body.Amount, 64)
		category := body.Category
		if category == "" {
			category = "Other"
		}
		if body.Label == "" || err != nil || amount <= 0 {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "label and a positive amount are required"})
			return
		}

		expenses = append(expenses, Expense{
			ID:       strconv.FormatInt(time.Now().UnixNano()/int64(time.Millisecond), 10),
			Label:    body.Label,
			Amount:   amount,
			Category: category,
		})
		writeJSON(w, http.StatusCreated, withStats())

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		filtered := expenses[:0]
		for _, e := range expenses {
			if e.ID != id {
				filtered = append(filtered, e)
			}
		}
		expenses = filtered
		writeJSON(w, http.StatusOK, withStats())

	default:
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
	}
}
