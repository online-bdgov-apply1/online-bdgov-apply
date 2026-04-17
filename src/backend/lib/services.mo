import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Int "mo:core/Int";
import ServicesTypes "../types/services";

module {
  public type ServiceList = List.List<ServicesTypes.Service>;

  public func getAll(services : ServiceList) : [ServicesTypes.Service] {
    services.toArray();
  };

  public func getActive(services : ServiceList) : [ServicesTypes.Service] {
    services.filter(func(s : ServicesTypes.Service) : Bool { s.active }).toArray();
  };

  public func getById(services : ServiceList, id : Text) : ?ServicesTypes.Service {
    services.find(func(s : ServicesTypes.Service) : Bool { s.id == id });
  };

  public func add(
    services : ServiceList,
    counter : Nat,
    name : Text,
    description : Text,
    price : Float,
    requirements : Text,
  ) : Text {
    let id = "svc-" # counter.toText() # "-" # Time.now().toText();
    let service : ServicesTypes.Service = {
      id;
      name;
      description;
      price;
      requirements;
      active = true;
      createdAt = Time.now();
    };
    services.add(service);
    id;
  };

  public func update(
    services : ServiceList,
    id : Text,
    name : Text,
    description : Text,
    price : Float,
    requirements : Text,
    active : Bool,
  ) : Bool {
    var found = false;
    services.mapInPlace(func(s : ServicesTypes.Service) : ServicesTypes.Service {
      if (s.id == id) {
        found := true;
        { s with name; description; price; requirements; active };
      } else { s };
    });
    found;
  };

  public func remove(services : ServiceList, id : Text) : Bool {
    let before = services.size();
    let filtered = services.filter(func(s : ServicesTypes.Service) : Bool { s.id != id });
    // Clear and re-populate
    services.clear();
    services.append(filtered);
    services.size() < before;
  };

  // Seed initial health services for first run
  public func seedIfEmpty(services : ServiceList) {
    if (services.size() > 0) return ();
    let seeds : [ServicesTypes.Service] = [
      {
        id = "svc-seed-1";
        name = "স্বাস্থ্য পরামর্শ সেবা";
        description = "অভিজ্ঞ চিকিৎসকের সাথে সরাসরি স্বাস্থ্য পরামর্শ সেবা";
        price = 500.0;
        requirements = "জাতীয় পরিচয়পত্র, মোবাইল নম্বর";
        active = true;
        createdAt = Time.now();
      },
      {
        id = "svc-seed-2";
        name = "ডায়াবেটিস স্ক্রিনিং প্যাকেজ";
        description = "সম্পূর্ণ ডায়াবেটিস পরীক্ষা ও রিপোর্ট সহ পরামর্শ";
        price = 1200.0;
        requirements = "জাতীয় পরিচয়পত্র, উপবাস অবস্থায় আসতে হবে";
        active = true;
        createdAt = Time.now();
      },
      {
        id = "svc-seed-3";
        name = "মাতৃস্বাস্থ্য সেবা প্যাকেজ";
        description = "গর্ভকালীন স্বাস্থ্য পরীক্ষা ও পরামর্শ সেবা";
        price = 800.0;
        requirements = "জাতীয় পরিচয়পত্র, সঙ্গে স্বামীর আইডি";
        active = true;
        createdAt = Time.now();
      },
      {
        id = "svc-seed-4";
        name = "শিশু টিকাদান প্রোগ্রাম";
        description = "সরকার অনুমোদিত শিশু টিকাদান সেবা ও স্বাস্থ্য কার্ড";
        price = 300.0;
        requirements = "শিশুর জন্ম নিবন্ধন, অভিভাবকের আইডি";
        active = true;
        createdAt = Time.now();
      },
    ];
    for (s in seeds.values()) {
      services.add(s);
    };
  };
};
