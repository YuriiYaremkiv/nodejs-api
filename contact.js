const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve("./db/contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err instanceof SyntaxError) {
      return `Invalid JSON format in contacts.json`;
    } else if (err.code === "ENOENT") {
      return `Sorry, contacts.json file not found`;
    } else {
      return err.message;
    }
  }
}

async function getContactById(contactId) {
  try {
    const data = await listContacts();
    const contact = data.find((contact) => contact.id == contactId);
    if (!contact) {
      throw new Error("Contact with this id was not found!");
    }
    return contact;
  } catch (err) {
    return err.message;
  }
}

async function removeContact(contactId) {
  try {
    const data = await listContacts();
    const newContacts = data.filter((contact) => contact.id !== contactId);
    if (data.length === newContacts.length) {
      throw new Error("There is no contact with this id!");
    }
    await fs.writeFile(contactsPath, "");
    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));

    const removeContact = data.find((contact) => contact.id == contactId);
    return `Contact "${removeContact.name}" has been deleted!`;
  } catch (err) {
    return err.message;
  }
}

async function addContact(name, email, phone) {
  try {
    if (!name || !email || !phone) {
      throw new Error("Enter all data");
    }

    const data = await listContacts();
    const contactExists = data.find((contact) => contact.name === name);

    if (contactExists) {
      throw new Error("This contact already exists");
    }

    const newId = String(
      data.reduce((max, item) => Math.max(max, Number(item.id)), 0) + 1
    );
    const newContact = {
      id: newId,
      name,
      email,
      phone,
    };

    data.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return `Contact "${name}" has been added`;
  } catch (err) {
    return err.message;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
