import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Text "mo:core/Text";
import AppTypes "../types/applications";

module {
  public type ApplicationList = List.List<AppTypes.Application>;

  public func getAll(applications : ApplicationList) : [AppTypes.Application] {
    applications.toArray();
  };

  public func getByPhone(applications : ApplicationList, phone : Text) : [AppTypes.Application] {
    applications.filter(func(a : AppTypes.Application) : Bool { a.phone == phone }).toArray();
  };

  public func getByRef(applications : ApplicationList, ref : Text) : ?AppTypes.Application {
    applications.find(func(a : AppTypes.Application) : Bool { a.refNumber == ref });
  };

  public func getById(applications : ApplicationList, id : Text) : ?AppTypes.Application {
    applications.find(func(a : AppTypes.Application) : Bool { a.id == id });
  };

  // Pad a text string on the left to a given width
  func padLeft(s : Text, width : Nat, pad : Char) : Text {
    var result = s;
    var i = s.size();
    while (i < width) {
      result := Text.fromChar(pad) # result;
      i += 1;
    };
    result;
  };

  // Generate reference number: TXN-YYYYMMDD-XXXX
  public func buildRefNumber(counter : Nat) : Text {
    let now = Time.now();
    let epochSeconds : Int = now / 1_000_000_000;
    let days : Int = epochSeconds / 86400;
    let year : Int = 1970 + days / 365;
    let dayOfYear : Int = Int.rem(days, 365);
    let month : Int = dayOfYear / 30 + 1;
    let day : Int = Int.rem(dayOfYear, 30) + 1;

    let yyyy = padLeft(year.toText(), 4, '0');
    let mm = padLeft(month.toText(), 2, '0');
    let dd = padLeft(day.toText(), 2, '0');
    let seq = padLeft((counter % 10000).toText(), 4, '0');
    "TXN-" # yyyy # mm # dd # "-" # seq;
  };

  public func submit(
    applications : ApplicationList,
    counter : Nat,
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
  ) : { #ok : Text; #err : Text } {
    let refNumber = buildRefNumber(counter);
    let id = "app-" # counter.toText() # "-" # Time.now().toText();

    let app : AppTypes.Application = {
      id;
      refNumber;
      customerName;
      fatherName;
      motherName;
      dob;
      phone;
      nid;
      presentAddress;
      permanentAddress;
      district;
      destinationCountry;
      purpose;
      transactionId;
      notes;
      status = "Pending";
      submittedAt = Time.now();
    };
    applications.add(app);
    #ok(refNumber);
  };

  public func updateStatus(
    applications : ApplicationList,
    appId : Text,
    status : Text,
  ) : { #ok : Text; #err : Text } {
    var found = false;
    applications.mapInPlace(func(a : AppTypes.Application) : AppTypes.Application {
      if (a.id == appId) {
        found := true;
        { a with status };
      } else { a };
    });
    if (found) #ok("স্ট্যাটাস আপডেট হয়েছে") else #err("আবেদনটি পাওয়া যায়নি");
  };

  public func countByStatus(applications : ApplicationList, status : Text) : Nat {
    applications.foldLeft<Nat, AppTypes.Application>(0, func(acc : Nat, a : AppTypes.Application) : Nat {
      if (a.status == status) acc + 1 else acc;
    });
  };
};
