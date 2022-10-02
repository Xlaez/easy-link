package main

import (
	"testing"

	"github.com/Xlaez/easy-link/notification/utils"
)

func Test_configMsgQueue(t *testing.T) {
	type args struct {
		config utils.Config
	}
	tests := []struct {
		name string
		args args
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			configMsgQueue(tt.args.config)
		})
	}
}
