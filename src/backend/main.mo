import List "mo:core/List";
import Map "mo:core/Map";
import ServicesTypes "types/services";
import AppTypes "types/applications";
import ServicesLib "lib/services";
import AuthMixin "mixins/auth-api";
import ServicesMixin "mixins/services-api";
import ApplicationsMixin "mixins/applications-api";
import PaymentsMixin "mixins/payments-api";
import ContactMixin "mixins/contact-api";



actor {
  // Core data stores
  let sessionTokens = Map.empty<Text, Int>();
  let services = List.empty<ServicesTypes.Service>();
  let applications = List.empty<AppTypes.Application>();

  // Payment config store: keys "bkash" and "nagad"
  let paymentStore = Map.empty<Text, Text>();

  // Contact config store: keys "helpline", "imo", "whatsapp"
  let contactStore = Map.empty<Text, Text>();

  // Sequential counters stored in single-key maps (avoids var — state persists via EOP)
  let tokenCounter = Map.empty<Text, Nat>();
  let serviceCounter = Map.empty<Text, Nat>();
  let appCounter = Map.empty<Text, Nat>();

  // Seed sample services on first load
  ServicesLib.seedIfEmpty(services);

  include AuthMixin(sessionTokens, tokenCounter);
  include ServicesMixin(services, sessionTokens, serviceCounter);
  include ApplicationsMixin(applications, sessionTokens, appCounter);
  include PaymentsMixin(sessionTokens, paymentStore);
  include ContactMixin(contactStore, sessionTokens);
};
