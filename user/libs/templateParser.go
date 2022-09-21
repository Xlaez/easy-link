package libs

import (
	"bytes"
	"errors"
	"fmt"
	"html/template"
	"path/filepath"
)

func parseTemplate(templateFileName string, data interface{}) (string, error) {
	templatePath, err := filepath.Abs(fmt.Sprintf("github.com/Xlaez/easy-link/templates/%s", templateFileName))

	if err != nil {
		return "", errors.New("cannot locate template")
	}

	t, err := template.ParseFiles(templatePath)

	if err != nil {
		return "", err
	}

	buffer := new(bytes.Buffer)
	if err = t.Execute(buffer, data); err != nil {
		return "", err
	}

	body := buffer.String()
	return body, nil
}
