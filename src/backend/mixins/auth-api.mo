import Map "mo:core/Map";
import AuthLib "../lib/auth";

mixin (sessionTokens : Map.Map<Text, Int>, tokenCounter : Map.Map<Text, Nat>) {

  public func verifyAdmin(username : Text, password : Text) : async { #ok : Text; #err : Text } {
    if (not AuthLib.verifyAdmin(username, password)) {
      return #err("ব্যবহারকারীর নাম বা পাসওয়ার্ড ভুল");
    };
    let count = switch (tokenCounter.get("count")) { case (?c) c; case null 0 };
    tokenCounter.add("count", count + 1);
    let token = AuthLib.generateToken(sessionTokens, count);
    #ok(token);
  };

  public func validateToken(token : Text) : async Bool {
    AuthLib.validateToken(sessionTokens, token);
  };

  public func logoutAdmin(token : Text) : async Bool {
    AuthLib.revokeToken(sessionTokens, token);
  };
};
