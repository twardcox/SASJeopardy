import App from "../src/App";
import { ExpansionPanelActions } from "@material-ui/core";

test("Get content returns an array with length of 5", () => {
  expect(getContent().length.toBe(5));
});
