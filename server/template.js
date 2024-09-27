import express from "express";
import "dotenv/config";
import morgan from "morgan";

const { API_URL } = process.env;

const app = express();
const HOST = "localhost";
const PORT = 4000;

const contacts = [
  {
    id: 1,
    name: "야무",
    email: "yamoo9@euid.dev",
  },
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create
app.post(`${API_URL}/contact`, (req, res) => {
  const newContact = { id: contacts.length + 1, ...req.body };
  contacts.push(newContact);
  res.send(newContact);
});

// Read
app.get(`${API_URL}/contacts`, (_req, res) => {
  res.send(contacts);
});

app.get(`${API_URL}/contact/:contactId`, (req, res) => {
  let { contactId } = req.params;
  const contact = contacts.find((contact) => contact.id === Number(contactId));
  if (!contact) {
    res.status(404).send({ message: `ID "${contactId}" 연락처는 존재하지 않습니다.` });
  } else {
    res.send(contact);
  }
});

// Update
app.put(`${API_URL}/contact/:contactId`, (req, res) => {
  let { contactId } = req.params;

  const contactIndex = contacts.findIndex((contact) => contact.id === Number(contactId));

  if (contactIndex > -1) {
    let index = Number(contactId) - 1;
    const contact = contacts[index];
    const updateContact = { ...contact, ...req.body };
    contacts[index] = updateContact;
    res.send(updateContact);
  } else {
    res.status(404).send({ message: `ID "${contactId}" 연락처는 존재하지 않습니다.` });
  }
});

// Delete
app.delete(`${API_URL}/contact/:contactId`, (req, res) => {
  let { contactId } = req.params;
  let contactIndex = contacts.findIndex((contact) => contact.id === Number(contactId));

  if (contactIndex > -1) {
    contacts.splice(contactIndex, 1);
    res.send({
      message: `ID "${contactId}" 연락처를 성공적으로 삭제했습니다.`,
    });
  } else {
    res.status(404).send({ message: `ID "${contactId}" 연락처는 존재하지 않습니다.` });
  }
});


app.listen(PORT, () => {
  console.log(API_URL); // → /api/v1
  console.log(`http://${HOST}:${PORT} 서버 구동 중...`);
});
