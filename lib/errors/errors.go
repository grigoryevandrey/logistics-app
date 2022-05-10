package errors

type Error string

func (e Error) Error() string { return string(e) }

const UNIQUE_CONSTRAINT_VIOLATION_SUBSTRING = "pq: duplicate key value violates unique constraint"

const Error401 = Error("401")
const Error403 = Error("403")
const Error404 = Error("404")
const Error409 = Error("409")
