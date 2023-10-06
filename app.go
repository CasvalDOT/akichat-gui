package main

import (
	"context"
	"os"
	"strings"

	core "github.com/CasvalDOT/akichat-core"
	"github.com/gen2brain/beeep"
)

// App struct
type App struct {
	ctx  context.Context
	chat core.Chat
}

type SnapResponse struct {
	Messages []core.Message `json:"messages"`
	Users    []core.User    `json:"users"`
}

type ReadResponse struct {
	Data SnapResponse `json:"data"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	chat := core.NewChat(core.ChatTypeHentakihabara)
	return &App{chat: chat}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Login authenticate the user into the chat
func (a *App) Login(userName string, password string) string {
	userID, _ := a.chat.Login(userName, password)
	return userID
}

func (a *App) Logout() {
	a.chat.Logout()
}

func (a *App) Read(index string) ReadResponse {
	messages, users, _ := a.chat.Snapshot(index)

	return ReadResponse{
		Data: SnapResponse{
			Messages: messages,
			Users:    users,
		},
	}
}

func (a *App) ChangeNickname(nickname string) {
	a.chat.ChangeUsername(nickname)
}

func (a *App) WriteMessage(message string) {
	a.chat.WriteMessage(message)
}

func (a *App) WritePrivateMessage(user string, message string) {
	a.chat.WritePrivateMessage(user, message)
}

func (a *App) IsAuthenticated() bool {
	return a.chat.IsAuthenticated()
}

func (a *App) GetKanjiList() []string {
	file, err := os.ReadFile("kanji.txt")
	if err != nil {
		return []string{}
	}
	return strings.Split(string(file), "\n")
}

func (a *App) Notify(title string, message string) {
	beeep.Alert(title, message, "")
}
