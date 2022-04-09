package errors

type Error string

func (e Error) Error() string { return string(e) }

const Error404 = Error("404")
