package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
)

const (
	templatePath = "README.template.md"
	outputPath   = "README.md"
	quoteURL     = "https://api.quotable.io/random"
)

var fallbackQuote = quoteResponse{
	Content: "The meaning of life is that it stops.",
	Author:  "Franz Kafka",
}

type quoteResponse struct {
	Content string `json:"content"`
	Author  string `json:"author"`
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
}

func run() error {
	quote, err := fetchQuote()
	if err != nil {
		fmt.Fprintf(os.Stderr, "warning: failed to fetch quote, using fallback quote: %v\n", err)
		quote = &fallbackQuote
	}

	templateBytes, err := os.ReadFile(templatePath)
	if err != nil {
		return fmt.Errorf("read template %q: %w", templatePath, err)
	}

	output := strings.ReplaceAll(string(templateBytes), "{quote}", quote.Content)
	output = strings.ReplaceAll(output, "{author}", quote.Author)

	if err := os.WriteFile(outputPath, []byte(output), 0o644); err != nil {
		return fmt.Errorf("write output %q: %w", outputPath, err)
	}

	return nil
}

func fetchQuote() (*quoteResponse, error) {
	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Get(quoteURL)
	if err != nil {
		return nil, fmt.Errorf("http get: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status %d", resp.StatusCode)
	}

	var quote quoteResponse
	if err := json.NewDecoder(resp.Body).Decode(&quote); err != nil {
		return nil, fmt.Errorf("decode response: %w", err)
	}

	if quote.Content == "" || quote.Author == "" {
		return nil, fmt.Errorf("invalid response payload")
	}

	return &quote, nil
}
