import Map "mo:core/Map";
import AuthLib "../lib/auth";
import PaymentsLib "../lib/payments";
import PaymentTypes "../types/payments";

mixin (
  sessionTokens : Map.Map<Text, Int>,
  paymentStore : Map.Map<Text, Text>,
) {
  public func getPaymentConfig() : async PaymentTypes.PaymentConfig {
    PaymentsLib.getConfig(paymentStore);
  };

  public func setPaymentConfig(
    token : Text,
    bkash : Text,
    nagad : Text,
  ) : async { #ok : Text; #err : Text } {
    if (not AuthLib.validateToken(sessionTokens, token)) {
      return #err("অননুমোদিত অ্যাক্সেস");
    };
    PaymentsLib.setConfig(paymentStore, bkash, nagad);
    #ok("পেমেন্ট কনফিগ আপডেট হয়েছে");
  };
};
