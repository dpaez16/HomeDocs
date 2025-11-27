package apachetika

import (
	"bytes"
	"context"
	"fmt"
	"os"

	"github.com/google/go-tika/tika"
)

func getTikaEndpointURL() string {
	host := os.Getenv("TIKA_HOST")
	port := os.Getenv("TIKA_PORT")

	return fmt.Sprintf(
		"http://%s:%s",
		host,
		port,
	)
}

func ExtractTextFromDocumentBuffer(buffer []byte) (string, error) {
	client := tika.NewClient(nil, getTikaEndpointURL())

	reader := bytes.NewReader(buffer)
	return client.Parse(context.TODO(), reader)
}
