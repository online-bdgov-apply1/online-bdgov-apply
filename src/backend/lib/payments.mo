import Map "mo:core/Map";
import PaymentTypes "../types/payments";

module {
  public type PaymentStore = Map.Map<Text, Text>;

  public func getConfig(store : PaymentStore) : PaymentTypes.PaymentConfig {
    let bkash = switch (store.get("bkash")) { case (?v) v; case null "" };
    let nagad = switch (store.get("nagad")) { case (?v) v; case null "" };
    { bkash; nagad };
  };

  public func setConfig(store : PaymentStore, bkash : Text, nagad : Text) {
    store.add("bkash", bkash);
    store.add("nagad", nagad);
  };
};
