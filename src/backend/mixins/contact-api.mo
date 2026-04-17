import Map "mo:core/Map";
import AuthLib "../lib/auth";
import ContactLib "../lib/contact";
import ContactTypes "../types/contact";

mixin (
  contactStore : Map.Map<Text, Text>,
  sessionTokens : Map.Map<Text, Int>,
) {
  public func getContactConfig() : async ContactTypes.ContactConfig {
    ContactLib.get(contactStore);
  };

  public func setContactConfig(
    token : Text,
    config : ContactTypes.ContactConfig,
  ) : async { #ok : Text; #err : Text } {
    if (not AuthLib.validateToken(sessionTokens, token)) {
      return #err("অননুমোদিত অ্যাক্সেস");
    };
    ContactLib.set(contactStore, config);
    #ok("যোগাযোগ কনফিগ আপডেট হয়েছে");
  };
};
