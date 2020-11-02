import { User } from "../types/User.type";
import { store } from "../libs/RavenDB";

async function add(name: string, password: string, isAdmin: boolean) {
  const session = store.openSession();

  const user = Object.assign(new User(), {
    name,
    password,
    is_admin: isAdmin
  });

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
  return session.query<User>(User).all();
}

async function getById(id: string): Promise<User | null> {
  const session = store.openSession();
  return await session.load<User>(id, User);
}

async function getByName(name: string): Promise<User | null> {
  const session = store.openSession();
  return await session
    .query<User>(User)
    .whereEquals("name", name)
    .firstOrNull();
}

async function getPasswordByName(name: string): Promise<string | null> {
  const session = store.openSession();
  return session
    .query(User)
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
