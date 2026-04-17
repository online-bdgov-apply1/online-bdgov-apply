import List "mo:core/List";
import Map "mo:core/Map";
import AuthLib "../lib/auth";
import ServicesLib "../lib/services";
import ServicesTypes "../types/services";

mixin (
  services : List.List<ServicesTypes.Service>,
  sessionTokens : Map.Map<Text, Int>,
  serviceCounter : Map.Map<Text, Nat>,
) {
  public func getServices() : async [ServicesTypes.Service] {
    ServicesLib.getActive(services);
  };

  public func getAllServicesAdmin(token : Text) : async { #ok : [ServicesTypes.Service]; #err : Text } {
    if (not AuthLib.validateToken(sessionTokens, token)) {
      return #err("অননুমোদিত অ্যাক্সেস");
    };
    #ok(ServicesLib.getAll(services));
  };

  public func addService(
    token : Text,
    name : Text,
    description : Text,
    price : Float,
    requirements : Text,
  ) : async { #ok : Text; #err : Text } {
    if (not AuthLib.validateToken(sessionTokens, token)) {
      return #err("অননুমোদিত অ্যাক্সেস");
    };
    let count = switch (serviceCounter.get("count")) { case (?c) c; case null 0 };
    serviceCounter.add("count", count + 1);
    let id = ServicesLib.add(services, count, name, description, price, requirements);
    #ok(id);
  };

  public func updateService(
    token : Text,
    id : Text,
    name : Text,
    description : Text,
    price : Float,
    requirements : Text,
    active : Bool,
  ) : async { #ok : Text; #err : Text } {
    if (not AuthLib.validateToken(sessionTokens, token)) {
      return #err("অননুমোদিত অ্যাক্সেস");
    };
    if (ServicesLib.update(services, id, name, description, price, requirements, active)) {
      #ok("সেবা আপডেট হয়েছে");
    } else {
      #err("সেবাটি পাওয়া যায়নি");
    };
  };

  public func deleteService(token : Text, id : Text) : async { #ok : Text; #err : Text } {
    if (not AuthLib.validateToken(sessionTokens, token)) {
      return #err("অননুমোদিত অ্যাক্সেস");
    };
    if (ServicesLib.remove(services, id)) {
      #ok("সেবা মুছে ফেলা হয়েছে");
    } else {
      #err("সেবাটি পাওয়া যায়নি");
    };
  };
};
