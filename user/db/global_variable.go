package db

type Notification struct {
	Content string
	UserID  string
	Link    string
	Brand   string
}

type GetUser struct {
	Name       string
	Country    string
	AvaratUrl  string
	FieldTitle string
}

type GetAllUserConnections struct {
	User1 string
	User2 string
}
