import React from "react";

import {
  Filter,
  Pipeline,
  Values,
  valuesChangedEvent,
  Tracking
} from "sajari-react/controllers";
import { AutocompleteInput } from "sajari-react/ui/text";
import { Response, Results, Summary, Paginator } from "sajari-react/ui/results";
import { TabsFacet } from "sajari-react/ui/facets";

import "sajari-react/ui/text/AutocompleteInput.css";
import "sajari-react/ui/results/Results.css";
import "sajari-react/ui/results/Paginator.css";
import "sajari-react/ui/facets/Tabs.css";

const project = "sajariptyltd";
const collection = "sajari-com";
const pipelineName = "website";

const values = new Values();
const tracking = new Tracking();
tracking.clickTokens("url");
const pipeline = new Pipeline(project, collection, pipelineName, tracking);

values.listen(valuesChangedEvent, (changes, set) => {
  if (!changes.page) {
    set({ page: "1" });
  }
});

const tabsFilter = new Filter(
  {
    All: "",
    Blog: "dir1='blog'",
    FAQ: "dir1='faq'"
  },
  "All"
);
values.set({ filter: () => tabsFilter.filter() });

const tabs = [
  { name: "All", displayText: "All" },
  { name: "Blog", displayText: "Blog" },
  { name: "FAQ", displayText: "FAQ" }
];

tabsFilter.listen(() => {
  if (values.get()["q"]) {
    values.emitChange();
    pipeline.search(values, tracking);
  }
});

const App = () =>
  <div className="searchApp">
    <AutocompleteInput values={values} pipeline={pipeline} focus={true} />
    <Response pipeline={pipeline}>
      <TabsFacet tabs={tabs} filter={tabsFilter} />
      <Summary values={values} pipeline={pipeline} />
      <Results pipeline={pipeline} />
      <Paginator values={values} pipeline={pipeline} />
    </Response>
  </div>;

export default App;
