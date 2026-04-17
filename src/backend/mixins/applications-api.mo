import List "mo:core/List";
import Map "mo:core/Map";
import AuthLib "../lib/auth";
import AppsLib "../lib/applications";
import AppTypes "../types/applications";

mixin (
  applications : List.List<AppTypes.Application>,
  sessionTokens : Map.Map<Text, Int>,
  appCounter : Map.Map<Text, Nat>,
) {
  public func submitApplication(
    customerName : Text,
    fatherName : Text,
    motherName : Text,
    dob : Text,
    phone : Text,
    nid : Text,
    presentAddress : Text,
    permanentAddress : Text,
    district : Text,
    destinationCountry : Text,
    purpose : Text,
    transactionId : Text,
    notes : Text,
  ) : async { #ok : Text; #err : Text } {
    let count = switch (appCounter.get("count")) { case (?c) c; case null 0 };
    appCounter.add("count", count + 1);
    AppsLib.submit(
      applications,
      count,
      customerName,
      fatherName,
      motherName,
      dob,
      phone,
      nid,
      presentAddress,
      permanentAddress,
      district,
      destinationCountry,
      purpose,
      transactionId,
      notes,
    );
  };

  public func getApplications(token : Text) : async { #ok : [AppTypes.Application]; #err : Text } {
    if (not AuthLib.validateToken(sessionTokens, token)) {
      return #err("অননুমোদিত অ্যাক্সেস");
    };
    #ok(AppsLib.getAll(applications));
  };

  public func getApplicationByPhone(phone : Text) : async [AppTypes.Application] {
    AppsLib.getByPhone(applications, phone);
  };

  public func getApplicationByRef(ref : Text) : async ?AppTypes.Application {
    AppsLib.getByRef(applications, ref);
  };

  public func updateApplicationStatus(
    token : Text,
    appId : Text,
    status : Text,
  ) : async { #ok : Text; #err : Text } {
    if (not AuthLib.validateToken(sessionTokens, token)) {
      return #err("অননুমোদিত অ্যাক্সেস");
    };
    AppsLib.updateStatus(applications, appId, status);
  };

  public func getStats(token : Text) : async { #ok : { total : Nat; pending : Nat; processing : Nat; approved : Nat; rejected : Nat }; #err : Text } {
    if (not AuthLib.validateToken(sessionTokens, token)) {
      return #err("অননুমোদিত অ্যাক্সেস");
    };
    let total = applications.size();
    let pending = AppsLib.countByStatus(applications, "Pending");
    let processing = AppsLib.countByStatus(applications, "Processing");
    let approved = AppsLib.countByStatus(applications, "Approved");
    let rejected = AppsLib.countByStatus(applications, "Rejected");
    #ok({ total; pending; processing; approved; rejected });
  };
};
