import Map "mo:core/Map";
import ContactTypes "../types/contact";

module {
  public type ContactStore = Map.Map<Text, Text>;

  let KEY_HELPLINE = "helpline";
  let KEY_IMO = "imo";
  let KEY_WHATSAPP = "whatsapp";
  let KEY_ESTABLISH_YEAR = "establishYear";

  public func get(store : ContactStore) : ContactTypes.ContactConfig {
    let helpline = switch (store.get(KEY_HELPLINE)) { case (?v) v; case null "" };
    let imo = switch (store.get(KEY_IMO)) { case (?v) v; case null "" };
    let whatsapp = switch (store.get(KEY_WHATSAPP)) { case (?v) v; case null "" };
    let establishYear = switch (store.get(KEY_ESTABLISH_YEAR)) { case (?v) v; case null "2019" };
    { helpline; imo; whatsapp; establishYear };
  };

  public func set(store : ContactStore, config : ContactTypes.ContactConfig) {
    store.add(KEY_HELPLINE, config.helpline);
    store.add(KEY_IMO, config.imo);
    store.add(KEY_WHATSAPP, config.whatsapp);
    store.add(KEY_ESTABLISH_YEAR, config.establishYear);
  };
};
