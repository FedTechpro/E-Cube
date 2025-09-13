export function saveUser(user) {
  localStorage.setItem("users", JSON.stringify([...getUsers(), user]));
}

export function getUsers() {
  let users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
}

export function authenticate(email, password) {
  if (!email || !password) {
    alert("Please fill in all fields");
    return;
  }
  const users = getUsers();
  return users.find(
    (user) => user.email === email && user.password === password
  );
}

export function saveSession(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function getSession() {
  return JSON.parse(localStorage.getItem("currentUser")) || null;
}

export function logout() {
  localStorage.removeItem("currentUser");
}
