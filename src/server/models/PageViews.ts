import { store } from "../libs/RavenDB";
import { PageViewEvent } from "../types/PageViewEvent.type";

async function add(event: PageViewEvent) {
  const session = store.openSession();
  await session.store(event);
  await session.saveChanges();
}

async function getByDate(projectId: string, startDate: string, endDate: string) {
  const session = store.openSession();
  return await session
    .query<PageViewEvent>(PageViewEvent)
    .whereEquals("project_id", projectId)
    .andAlso()
    .whereBetween("date", startDate, endDate)
    .all();
}

async function getByPath(projectId: string, startDate: string, endDate: string, page: number) {
  const session = store.openSession();
  return await session
    .query<PageViewEvent>(PageViewEvent)
    .whereEquals("project_id", projectId)
    .andAlso()
    .whereBetween("date", startDate, endDate)
    .groupBy("project_id", "date", "path")
    .selectCount()
    .orderByDescending("count()")
    .take(10)
    .skip(10 * page)
    .all();
}

async function getByReferrer(projectId: string, startDate: string, endDate: string, page: number) {
  const session = store.openSession();
  return await session
    .query<PageViewEvent>(PageViewEvent)
    .whereEquals("project_id", projectId)
    .andAlso()
    .whereBetween("date", startDate, endDate)
    .groupBy("project_id", "date", "referrer")
    .selectCount()
    .selectFields("key()", "name")
    .orderByDescending("count()")
    .take(10)
    .skip(10 * page)
    .all();
}

async function getByBrowserName(projectId: string, startDate: string, endDate: string, page: number) {
  const session = store.openSession();
  return await session
    .query<PageViewEvent>(PageViewEvent)
    .whereEquals("project_id", projectId)
    .andAlso()
    .whereBetween("date", startDate, endDate)
    .groupBy("project_id", "date", "browser_name")
    .selectCount()
    .selectFields("key()", "name")
    .orderByDescending("count()")
    .take(10)
    .skip(10 * page)
    .all();
}

async function getByBrowserNameVersion(projectId: string, startDate: string, endDate: string, page: number) {
  const session = store.openSession();
  return await session
    .query<PageViewEvent>(PageViewEvent)
    .whereEquals("project_id", projectId)
    .andAlso()
    .whereBetween("date", startDate, endDate)
    .groupBy("project_id", "date", "browser_name_version")
    .selectCount()
    .selectFields("key()", "name")
    .orderByDescending("count()")
    .take(10)
    .skip(10 * page)
    .all();
}

export default {
  add,
  getByDate,
  getByPath,
  getByReferrer,
  getByBrowserName,
  getByBrowserNameVersion
};
