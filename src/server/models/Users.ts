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
  const session = store.openSession();
  await session.store(user, id);
  await session.saveChanges();
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
  return session.query<User>("Users").all();
}

async function getById(id: string): Promise<User | null> {
  const session = store.openSession();
  return await session.load<User>(id);
}

async function getByName(name: string): Promise<User | null> {
  const session = store.openSession();
  return await session
    .query<User>("Users")
    .whereEquals("name", name)
    .firstOrNull();
}

async function getPasswordByName(name: string): Promise<string | null> {
  const session = store.openSession();
  return session
    .query("users")
    .whereEquals("name", name)
    .selectFields<string>("password")
    .firstOrNull();
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
