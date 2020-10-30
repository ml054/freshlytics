import Postgres from "../libs/Postgres";
import { User } from "../types/User.type";
import { store } from "../libs/RavenDB";

async function add(name: string, password: string, isAdmin: boolean) {
  const session = store.openSession();
  const user = {
    name,
    password,
    is_admin: isAdmin
  } as User;

  await session.store(user, "users/");
  await session.saveChanges();
}

async function update(id: string, user: User) {
  const statement = `
    UPDATE
      users 
    SET
      name = $2,
      is_admin = $3,
      updated_at = NOW()
    WHERE
      id = $1
  `;

  await Postgres.query(statement, [id, user.name, String(user.is_admin)]);
}

async function updatePassword(id: string, password: string) {
  const session = store.openSession();
  session.advanced.patch(id, "password", password);
  await session.saveChanges();
}

async function remove(id: string) {
  const session = store.openSession();
  await session.delete(id);
}

async function getAll(): Promise<User[]> {
  const session = store.openSession();
  return session.query<User>("users").all();
}

async function getById(id: string): Promise<User> {
  const statement = "SELECT id, name, is_admin FROM users WHERE id = $1";
  const result = await Postgres.query(statement, [id]);
  return result.rows[0];
}

async function getByName(name: string): Promise<User> {
  const session = store.openSession();
  return session
    .query<User>("users")
    .whereEquals("name", name)
    .first();
}

async function getPasswordByName(name: string): Promise<string | null> {
  const session = store.openSession();
  return session
    .query("users")
    .whereEquals("name", name)
    .selectFields<string>("password")
    .first();
}

export default {
  add,
  update,
  updatePassword,
  remove,
  getAll,
  getById,
  getByName,
  getPasswordByName
};
