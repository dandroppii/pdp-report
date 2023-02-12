import Mock from "fake-db/mock";
import { cardList } from "./data";
import { pdpTraffic } from "./pdp-traffic";
import { productTraffic } from "./product-traffic";


Mock.onGet("/api/dashboard-cards").reply(() => {
  try {
    return [200, cardList];
  } catch (err) {
    console.error(err);
    return [500, { message: "Internal server error" }];
  }
});

Mock.onGet("/api/pdp-traffic").reply(() => {
  try {
    return [200, pdpTraffic];
  } catch (err) {
    console.error(err);
    return [500, { message: "Internal server error" }];
  }
});


Mock.onGet("/api/product-traffic").reply(() => {
  try {
    return [200, productTraffic];
  } catch (err) {
    console.error(err);
    return [500, { message: "Internal server error" }];
  }
});
