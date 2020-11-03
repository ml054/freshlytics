import { store } from "../libs/RavenDB";
import { PageViewEvent } from "../types/PageViewEvent.type";
import { QueryData } from "ravendb";

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
    .groupBy("project_id", "date")
    .selectKey("date", "date")
    .selectCount("total")
    .all();
}

function reportQuery(q: any, page: number) {
  return q
    .selectCount("total_rows")
    .selectFields(new QueryData(["date", "count()"], ["date", "total"]))
    .orderByDescending("count()")
    .take(10)
    .skip(10 * page)
    .all();
}

async function getByPath(projectId: string, startDate: string, endDate: string, page: number) {
  const session = store.openSession();
  return await reportQuery(
    session
      .query<PageViewEvent>(PageViewEvent)
      .whereEquals("project_id", projectId)
      .andAlso()
      .whereBetween("date", startDate, endDate)
      .groupBy("project_id", "date", "path"),
    page
  );
}

async function getByReferrer(projectId: string, startDate: string, endDate: string, page: number) {
  const session = store.openSession();
  return await reportQuery(
    session
      .query<PageViewEvent>(PageViewEvent)
      .whereEquals("project_id", projectId)
      .andAlso()
      .whereBetween("date", startDate, endDate)
      .groupBy("project_id", "date", "referrer"),
    page
  );
}

async function getByBrowserName(projectId: string, startDate: string, endDate: string, page: number) {
  const session = store.openSession();
  return await reportQuery(
    session
      .query<PageViewEvent>(PageViewEvent)
      .whereEquals("project_id", projectId)
      .andAlso()
      .whereBetween("date", startDate, endDate)
      .groupBy("project_id", "date", "browser_name"),
    page
  );
}

async function getByBrowserNameVersion(projectId: string, startDate: string, endDate: string, page: number) {
  const session = store.openSession();
  return await reportQuery(
    session
      .query<PageViewEvent>(PageViewEvent)
      .whereEquals("project_id", projectId)
      .andAlso()
      .whereBetween("date", startDate, endDate)
      .groupBy("project_id", "date", "browser_name_version"),
    page
  );
}

export default {
  add,
  getByDate,
  getByPath,
  getByReferrer,
  getByBrowserName,
  getByBrowserNameVersion
};
