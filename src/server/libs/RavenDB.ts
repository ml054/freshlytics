import { DocumentStore } from "ravendb";
import config from "../config";

export const store = new DocumentStore(config.ravendbUrl, config.ravendbDatabase);

store.initialize();
