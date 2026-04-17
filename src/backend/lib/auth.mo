import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";

module {
  public type SessionTokens = Map.Map<Text, Int>;

  // Admin credentials — hardcoded server-side only, never returned to clients
  let ADMIN_USERNAME : Text = "nuralom1";
  let ADMIN_PASSWORD : Text = "Nuralom8956@#$";
  // Token TTL: 24 hours in nanoseconds
  let TOKEN_TTL_NS : Int = 86_400_000_000_000;

  public func verifyAdmin(username : Text, password : Text) : Bool {
    username == ADMIN_USERNAME and password == ADMIN_PASSWORD;
  };

  public func generateToken(tokens : SessionTokens, counter : Nat) : Text {
    let now = Time.now();
    let token = "tok-" # now.toText() # "-" # counter.toText();
    tokens.add(token, now + TOKEN_TTL_NS);
    token;
  };

  public func validateToken(tokens : SessionTokens, token : Text) : Bool {
    let now = Time.now();
    switch (tokens.get(token)) {
      case (?expiry) { expiry > now };
      case null { false };
    };
  };

  public func revokeToken(tokens : SessionTokens, token : Text) : Bool {
    switch (tokens.get(token)) {
      case (?_) {
        tokens.remove(token);
        true;
      };
      case null { false };
    };
  };

  public func purgeExpired(tokens : SessionTokens) {
    let now = Time.now();
    let toRemove = List.empty<Text>();
    for ((k, expiry) in tokens.entries()) {
      if (expiry <= now) {
        toRemove.add(k);
      };
    };
    for (k in toRemove.values()) {
      tokens.remove(k);
    };
  };
};
