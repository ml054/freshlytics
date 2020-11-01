import { Project } from "../types/Project.type";
import { store } from "../libs/RavenDB";

async function add(id: string, name: string, timezone: string) {
  const session = store.openSession();
  const project = {
    id,
    name,
    timezone
  } as Project;

  await session.store(project, id);
  await session.saveChanges();
}

async function update(id: string, project: Project) {
  const session = store.openSession();
  await session.store(project, id);
  await session.saveChanges();
}

async function remove(id: string) {
  const session = store.openSession();
  await session.delete(id);
  await session.saveChanges();
}

async function getAll(): Promise<Project[]> {
  const session = store.openSession();
  return session.query<Project>("Projects").all();
}

async function getById(id: string): Promise<Project> {
  const session = store.openSession();
  return session.load<Project>(id);
}

export default {
  add,
  update,
  remove,
  getAll,
  getById
};
