import Mock from "fake-db/mock";
import { pdpTraffic } from "./pdp-traffic";
import { productTraffic } from "./product-traffic";



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
