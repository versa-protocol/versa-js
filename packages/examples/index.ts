interface DemoReceiver {
  name: string;
  logo: string;
  logo_dark: string;
}

import { Org, Receipt } from "@versaprotocol/schema";

import rocketco from "./senders/rocketco.json";

// Senders
import asana from "./senders/asana.json";
import curb from "./senders/curb.json";
import generic from "./senders/generic.json";
import uber from "./senders/uber.json";
import amazon from "./senders/amazon.json";
import american from "./senders/american.json";
import clover from "./senders/clover.json";
import doordash from "./senders/doordash.json";
import dunkin from "./senders/dunkin.json";
import figma from "./senders/figma.json";
import hertz from "./senders/hertz.json";
import homedepot from "./senders/homedepot.json";
import instacart from "./senders/instacart.json";
import marriott from "./senders/marriott.json";
import shopify from "./senders/shopify.json";
import sysco from "./senders/sysco.json";
import tmobile from "./senders/tmobile.json";
import delta from "./senders/delta.json";
import carey from "./senders/carey.json";
import klm from "./senders/klm.json";
import korean from "./senders/korean.json";
import airfrance from "./senders/airfrance.json";
import singapore_air from "./senders/singapore_air.json";
import amtrak from "./senders/amtrak.json";
import avis from "./senders/avis.json";
import sixt from "./senders/sixt.json";

// Rail
import caltrain from "./senders/caltrain.json";
import metrolink from "./senders/metrolink.json";

import _305_transportation_services from "./senders/305_transportation_services.json";
import _3sixty from "./senders/3sixty.json";
import a1a_global_ground from "./senders/a1a_global_ground.json";
import aaa_corporate_travel from "./senders/aaa_corporate_travel.json";
import adyen from "./senders/adyen.json";
import aer_lingus from "./senders/aer_lingus.json";
import aerolineas_argentinas from "./senders/aerolineas_argentinas.json";
import aeromexi from "./senders/aeromexi.json";
import agia_affinity from "./senders/agia_affinity.json";
import agua_caliente_resort_casino_and_spa from "./senders/agua_caliente_resort_casino_and_spa.json";
import aimbridge_hospitality from "./senders/aimbridge_hospitality.json";
import air_canada from "./senders/air_canada.json";
import air_charter_service from "./senders/air_charter_service.json";
import air_china from "./senders/air_china.json";
import air_general_traveler_services from "./senders/air_general_traveler_services.json";
import air_india from "./senders/air_india.json";
import air_planning from "./senders/air_planning.json";
import altour from "./senders/altour.json";
import amadeus_it_group from "./senders/amadeus_it_group.json";
import american_express from "./senders/american_express.json";
import american_express_global_business_travel from "./senders/american_express_global_business_travel.json";
import amgine from "./senders/amgine.json";
import amtrav from "./senders/amtrav.json";
import ana_holdings_inc from "./senders/ana_holdings_inc.json";
import api_accommodations_plus_international from "./senders/api_accommodations_plus_international.json";
import arc_28 from "./senders/arc_28.json";
import areka_consulting from "./senders/areka_consulting.json";
import arlo_hotels from "./senders/arlo_hotels.json";
import atlas_travel_and_technology_group from "./senders/atlas_travel_and_technology_group.json";
import avianca_airlines from "./senders/avianca_airlines.json";
import avis_budget_group from "./senders/avis_budget_group.json";
import bank_of_america_corp from "./senders/bank_of_america_corp.json";
import bcd_travel_usa_llc from "./senders/bcd_travel_usa_llc.json";
import bellwood_global_transportation from "./senders/bellwood_global_transportation.json";
import bend from "./senders/bend.json";
import bwh_hotels from "./senders/bwh_hotels.json";
import bill_com from "./senders/bill_com.json";
import blacklane_gmbh from "./senders/blacklane_gmbh.json";
import the_bls_company from "./senders/the_bls_company.json";
import booking_com from "./senders/booking_com.json";
import brex_pilot from "./senders/brex_pilot.json";
import british_airways from "./senders/british_airways.json";
import captrav from "./senders/captrav.json";
import carey_international from "./senders/carey_international.json";
import christopherson_business_travel from "./senders/christopherson_business_travel.json";
import cerebri_ai from "./senders/cerebri_ai.json";
import chapman_freeborn_airchartering from "./senders/chapman_freeborn_airchartering.json";
import chetu from "./senders/chetu.json";
import choice_hotels_international from "./senders/choice_hotels_international.json";
import cibtvisas from "./senders/cibtvisas.json";
import cirium from "./senders/cirium.json";
import cornerstone_information_systems from "./senders/cornerstone_information_systems.json";
import citi_5 from "./senders/citi_5.json";
import clc_lodging from "./senders/clc_lodging.json";
import club_quarters from "./senders/club_quarters.json";
import sap_concur from "./senders/sap_concur.json";
import conferma from "./senders/conferma.json";
import copa_airlines from "./senders/copa_airlines.json";
import coraltree_hospitality from "./senders/coraltree_hospitality.json";
import corporate_traveler from "./senders/corporate_traveler.json";
import crescent_hotels_and_resorts from "./senders/crescent_hotels_and_resorts.json";
import crisis24 from "./senders/crisis24.json";
import china_southern_airlines from "./senders/china_southern_airlines.json";
import corporate_travel_management_ctm from "./senders/corporate_travel_management_ctm.json";
import cvent_inc from "./senders/cvent_inc.json";
import cwt_2 from "./senders/cwt_2.json";
import dav_el_bostoncoach from "./senders/dav_el_bostoncoach.json";
import visit_denver from "./senders/visit_denver.json";
import derbysoft from "./senders/derbysoft.json";
import design_hotels from "./senders/design_hotels.json";
import direct_travel from "./senders/direct_travel.json";
import bespoke_transportation from "./senders/bespoke_transportation.json";
import discover_dekalb_convention_and_visitors_bureau from "./senders/discover_dekalb_convention_and_visitors_bureau.json";
import discover_dunwoody from "./senders/discover_dunwoody.json";
import drury_hotels from "./senders/drury_hotels.json";
import emburse from "./senders/emburse.json";
import emirates_group from "./senders/emirates_group.json";
import empirecls_worldwide_chauffeured_services from "./senders/empirecls_worldwide_chauffeured_services.json";
import encora from "./senders/encora.json";
import enterprise_mobility from "./senders/enterprise_mobility.json";
import epicka from "./senders/epicka.json";
import eurostar_international_ltd from "./senders/eurostar_international_ltd.json";
import eva_airways_corporation from "./senders/eva_airways_corporation.json";
import everbridge from "./senders/everbridge.json";
import executive_protection_transport from "./senders/executive_protection_transport.json";
import expensify from "./senders/expensify.json";
import extended_stay_america from "./senders/extended_stay_america.json";
import fcm_travel from "./senders/fcm_travel.json";
import festive_road from "./senders/festive_road.json";
import first_hospitality from "./senders/first_hospitality.json";
import asiana_airlines from "./senders/asiana_airlines.json";
import tap_air_portugal from "./senders/tap_air_portugal.json";
import four_seasons from "./senders/four_seasons.json";
import fox_world_travel from "./senders/fox_world_travel.json";
import front_3 from "./senders/front_3.json";
import frontier_airlines_2 from "./senders/frontier_airlines_2.json";
import frosch_travel from "./senders/frosch_travel.json";
import g3_global_services from "./senders/g3_global_services.json";
import g6_hospitality from "./senders/g6_hospitality.json";
import gbta_zone from "./senders/gbta_zone.json";
import gem_worldwide_ground_transportation_service from "./senders/gem_worldwide_ground_transportation_service.json";
import genre_hotels from "./senders/genre_hotels.json";
import global_guardian from "./senders/global_guardian.json";
import globalkom_doo from "./senders/globalkom_doo.json";
import greater_miami_convention_and_visitors_bureau from "./senders/greater_miami_convention_and_visitors_bureau.json";
import goldenclasslimo from "./senders/goldenclasslimo.json";
import graduate_hotels from "./senders/graduate_hotels.json";
import accor_s_a from "./senders/accor_s_a.json";
import groupize from "./senders/groupize.json";
import hard_rock_hotel from "./senders/hard_rock_hotel.json";
import healix from "./senders/healix.json";
import hilton_hotels from "./senders/hilton_hotels.json";
import hopper from "./senders/hopper.json";
import hq from "./senders/hq.json";
import hrs_gmbh from "./senders/hrs_gmbh.json";
import hubli from "./senders/hubli.json";
import hyatt from "./senders/hyatt.json";
import iata from "./senders/iata.json";
import indian_hotels_company_limited from "./senders/indian_hotels_company_limited.json";
import ihg_hotels_and_resorts from "./senders/ihg_hotels_and_resorts.json";
import international_sos from "./senders/international_sos.json";
import island_hospitality_management from "./senders/island_hospitality_management.json";
import ita_airways from "./senders/ita_airways.json";
import itep_international_test_of_english_proficiency from "./senders/itep_international_test_of_english_proficiency.json";
import itilite from "./senders/itilite.json";
import its from "./senders/its.json";
import japan_airlines_co_ltd from "./senders/japan_airlines_co_ltd.json";
import jetblue from "./senders/jetblue.json";
import delux_public_charter_llc_dba_jsx_air from "./senders/delux_public_charter_llc_dba_jsx_air.json";
import jtb_business_travel from "./senders/jtb_business_travel.json";
import kenya_2 from "./senders/kenya_2.json";
import korean_air from "./senders/korean_air.json";
import ksl_resorts from "./senders/ksl_resorts.json";
import langham_hospitality_group from "./senders/langham_hospitality_group.json";
import latam_airlines_2 from "./senders/latam_airlines_2.json";
import leonardo_hotel_group from "./senders/leonardo_hotel_group.json";
import limos4 from "./senders/limos4.json";
import lot_polish_airlines from "./senders/lot_polish_airlines.json";
import lufthansa from "./senders/lufthansa.json";
import luma_hotels from "./senders/luma_hotels.json";
import lyft from "./senders/lyft.json";
import lyndon_group from "./senders/lyndon_group.json";
import makeready from "./senders/makeready.json";
import middle_east_airlines from "./senders/middle_east_airlines.json";
import melia_hotels_international_sa from "./senders/melia_hotels_international_sa.json";
import mesh_payments from "./senders/mesh_payments.json";
import millennium_and_copthorne_hotels_plc from "./senders/millennium_and_copthorne_hotels_plc.json";
import mint_house from "./senders/mint_house.json";
import my_place_hotels from "./senders/my_place_hotels.json";
import new_waterloo from "./senders/new_waterloo.json";
import nobu_hotel_atlanta_and_nobu_hotel_london_portman_square from "./senders/nobu_hotel_atlanta_and_nobu_hotel_london_portman_square.json";
import nomad_esim from "./senders/nomad_esim.json";
import nomadic_2 from "./senders/nomadic_2.json";
import omega_world_travel from "./senders/omega_world_travel.json";
import oneworld_alliance from "./senders/oneworld_alliance.json";
import oth_hotels_resorts from "./senders/oth_hotels_resorts.json";
import oversee from "./senders/oversee.json";
import oversight from "./senders/oversight.json";
import pan_pacific_hotels_group from "./senders/pan_pacific_hotels_group.json";
import passports_and_visas_com from "./senders/passports_and_visas_com.json";
import philippine_airlines from "./senders/philippine_airlines.json";
import private_jet_services from "./senders/private_jet_services.json";
import planned from "./senders/planned.json";
import pm_hotel_group from "./senders/pm_hotel_group.json";
import posadas from "./senders/posadas.json";
import pothos from "./senders/pothos.json";
import predictx_ltd from "./senders/predictx_ltd.json";
import preferred_hotels_and_resorts from "./senders/preferred_hotels_and_resorts.json";
import premier_luxury_car_service from "./senders/premier_luxury_car_service.json";
import prime_numbers_technology from "./senders/prime_numbers_technology.json";
import prince_waikiki_prince_hotels_japan from "./senders/prince_waikiki_prince_hotels_japan.json";
import red_roof from "./senders/red_roof.json";
import reed_and_mackay_travel from "./senders/reed_and_mackay_travel.json";
import reloquest from "./senders/reloquest.json";
import rma_worldwide_chauffeured_transportation from "./senders/rma_worldwide_chauffeured_transportation.json";
import sabre from "./senders/sabre.json";
import sanctuary_hotel_new_york_and_hotel_hugo from "./senders/sanctuary_hotel_new_york_and_hotel_hugo.json";
import scandinavian_airlines_3 from "./senders/scandinavian_airlines_3.json";
import saudia from "./senders/saudia.json";
import sentral from "./senders/sentral.json";
import sertifi from "./senders/sertifi.json";
import shell from "./senders/shell.json";
import singapore_airlines from "./senders/singapore_airlines.json";
import sixt_se from "./senders/sixt_se.json";
import skyteam_delta_partners from "./senders/skyteam_delta_partners.json";
import sonesta from "./senders/sonesta_international_hotels.json";
import southwest_airlines from "./senders/southwest_airlines.json";
import spotnana from "./senders/spotnana.json";
import ssn_hotels from "./senders/ssn_hotels.json";
import aka_hotels_and_hotel_residences from "./senders/aka_hotels_and_hotel_residences.json";
import stayapt_suites from "./senders/stayapt_suites.json";
import level_hotels_and_furnished_suites from "./senders/level_hotels_and_furnished_suites.json";
import staypineapple from "./senders/staypineapple.json";
import stay_sojo from "./senders/stay_sojo.json";
import sunnys_limousine from "./senders/sunnys_limousine.json";
import synergy_global_housing from "./senders/synergy_global_housing.json";
import taxback_international from "./senders/taxback_international.json";
import ascott_international_management_2001_pte from "./senders/ascott_international_management_2001_pte.json";
import blueground from "./senders/blueground.json";
import the_parking_spot from "./senders/the_parking_spot.json";
import the_whitehall_hotel_chicago from "./senders/the_whitehall_hotel_chicago.json";
import the_zetter from "./senders/the_zetter.json";
import thon_hotels from "./senders/thon_hotels.json";
import thrust_carbon_ltd from "./senders/thrust_carbon_ltd.json";
import tmcon from "./senders/tmcon.json";
import townsend_hotel from "./senders/townsend_hotel.json";
import u_s_bank_travelbank from "./senders/u_s_bank_travelbank.json";
import travel_incorporated from "./senders/travel_incorporated.json";
import travelport from "./senders/travelport.json";
import travelution_dmc from "./senders/travelution_dmc.json";
import trip_biz from "./senders/trip_biz.json";
import tripkicks from "./senders/tripkicks.json";
import tripstax_technologies from "./senders/tripstax_technologies.json";
import trondent_development from "./senders/trondent_development.json";
import troop_travel from "./senders/troop_travel.json";
import transportation_security_administration from "./senders/transportation_security_administration.json";
import turkish_airlines from "./senders/turkish_airlines.json";
import uatp from "./senders/uatp.json";
import united_airlines from "./senders/united_airlines.json";
import unlocked_data from "./senders/unlocked_data.json";
import china_eastern_airlines from "./senders/china_eastern_airlines.json";
import u_s_sedan_service_worldwide from "./senders/u_s_sedan_service_worldwide.json";
import valencia_hotel_collection from "./senders/valencia_hotel_collection.json";
import vat_it from "./senders/vat_it.json";
import vindow from "./senders/vindow.json";
import virgin_atlantic_airways from "./senders/virgin_atlantic_airways.json";
import visa from "./senders/visa.json";
import accelya from "./senders/accelya.json";
import the_walker_hotels from "./senders/the_walker_hotels.json";
import wallypark_airport_parking from "./senders/wallypark_airport_parking.json";
import warwick_hotels_and_resorts from "./senders/warwick_hotels_and_resorts.json";
import wex from "./senders/wex.json";
import wheels_up from "./senders/wheels_up.json";
import wordly from "./senders/wordly.json";
import world_travel from "./senders/world_travel.json";
import world_travel_protection from "./senders/world_travel_protection.json";
import wwstay from "./senders/wwstay.json";
import air_france_2 from "./senders/air_france_2.json";
import wyndham_hotels_and_resorts from "./senders/wyndham_hotels_and_resorts.json";
import xiamen_airlines from "./senders/xiamen_airlines.json";
import yotel from "./senders/yotel.json";
import zeno_by_serko from "./senders/zeno_by_serko.json";
import zoho from "./senders/zoho.json";
import lowes from "./senders/lowes.json";

// Receipts
import rideshare_receipt from "./receipts/rideshare.json";
import rideshare_polyline_receipt from "./receipts/rideshare_polyline.json";
import lodging_receipt from "./receipts/lodging.json";
import flight_receipt from "./receipts/flight.json";
import redeye_receipt from "./receipts/redeye.json";
import flight_multileg_receipt from "./receipts/flight_multileg.json";
import subscription_receipt from "./receipts/subscription.json";
import simple_receipt from "./receipts/simple.json";
import car_rental_receipt from "./receipts/car_rental.json";
import ecommerce_receipt from "./receipts/ecommerce.json";
import rail_receipt from "./receipts/rail.json";

// Receivers
import navan from "./receivers/navan.json";
import brex from "./receivers/brex.json";
import ramp from "./receivers/ramp.json";
import acme from "./receivers/acme.json";
import traxo from "./receivers/traxo.json";
import chrome_river from "./receivers/chrome_river.json";
import airbase from "./receivers/airbase.json";

const untypedSenders = {
  rocketco,
  curb,
  uber,
  amazon,
  american,
  clover,
  doordash,
  dunkin,
  figma,
  generic,
  hertz,
  homedepot,
  instacart,
  marriott,
  shopify,
  sysco,
  tmobile,
  delta,
  klm,
  korean,
  airfrance,
  singapore_air,
  amtrak,
  avis,
  caltrain,
  metrolink,
  _305_transportation_services,
  _3sixty,
  a1a_global_ground,
  aaa_corporate_travel,
  adyen,
  aer_lingus,
  aerolineas_argentinas,
  aeromexi,
  agia_affinity,
  agua_caliente_resort_casino_and_spa,
  aimbridge_hospitality,
  air_canada,
  air_charter_service,
  air_china,
  air_general_traveler_services,
  air_india,
  air_planning,
  altour,
  amadeus_it_group,
  american_express,
  american_express_global_business_travel,
  amgine,
  amtrav,
  ana_holdings_inc,
  api_accommodations_plus_international,
  arc_28,
  areka_consulting,
  arlo_hotels,
  atlas_travel_and_technology_group,
  avianca_airlines,
  avis_budget_group,
  bank_of_america_corp,
  bcd_travel_usa_llc,
  bellwood_global_transportation,
  bend,
  bwh_hotels,
  bill_com,
  blacklane_gmbh,
  the_bls_company,
  booking_com,
  brex_pilot,
  british_airways,
  captrav,
  carey_international,
  christopherson_business_travel,
  cerebri_ai,
  chapman_freeborn_airchartering,
  chetu,
  choice_hotels_international,
  cibtvisas,
  cirium,
  cornerstone_information_systems,
  citi_5,
  clc_lodging,
  club_quarters,
  sap_concur,
  conferma,
  copa_airlines,
  coraltree_hospitality,
  corporate_traveler,
  crescent_hotels_and_resorts,
  crisis24,
  china_southern_airlines,
  corporate_travel_management_ctm,
  cvent_inc,
  cwt_2,
  dav_el_bostoncoach,
  visit_denver,
  derbysoft,
  design_hotels,
  direct_travel,
  bespoke_transportation,
  discover_dekalb_convention_and_visitors_bureau,
  discover_dunwoody,
  drury_hotels,
  emburse,
  emirates_group,
  empirecls_worldwide_chauffeured_services,
  encora,
  enterprise_mobility,
  epicka,
  eurostar_international_ltd,
  eva_airways_corporation,
  everbridge,
  executive_protection_transport,
  expensify,
  extended_stay_america,
  fcm_travel,
  festive_road,
  first_hospitality,
  asiana_airlines,
  tap_air_portugal,
  four_seasons,
  fox_world_travel,
  front_3,
  frontier_airlines_2,
  frosch_travel,
  g3_global_services,
  g6_hospitality,
  gbta_zone,
  gem_worldwide_ground_transportation_service,
  genre_hotels,
  global_guardian,
  globalkom_doo,
  greater_miami_convention_and_visitors_bureau,
  goldenclasslimo,
  graduate_hotels,
  accor_s_a,
  groupize,
  hard_rock_hotel,
  healix,
  hilton_hotels,
  hopper,
  hq,
  hrs_gmbh,
  hubli,
  hyatt,
  iata,
  indian_hotels_company_limited,
  ihg_hotels_and_resorts,
  international_sos,
  island_hospitality_management,
  ita_airways,
  itep_international_test_of_english_proficiency,
  itilite,
  its,
  japan_airlines_co_ltd,
  jetblue,
  delux_public_charter_llc_dba_jsx_air,
  jtb_business_travel,
  kenya_2,
  korean_air,
  ksl_resorts,
  langham_hospitality_group,
  latam_airlines_2,
  leonardo_hotel_group,
  limos4,
  lot_polish_airlines,
  lufthansa,
  luma_hotels,
  lyft,
  lyndon_group,
  makeready,
  middle_east_airlines,
  melia_hotels_international_sa,
  mesh_payments,
  millennium_and_copthorne_hotels_plc,
  mint_house,
  my_place_hotels,
  new_waterloo,
  nobu_hotel_atlanta_and_nobu_hotel_london_portman_square,
  nomad_esim,
  nomadic_2,
  omega_world_travel,
  oneworld_alliance,
  oth_hotels_resorts,
  oversee,
  oversight,
  pan_pacific_hotels_group,
  passports_and_visas_com,
  philippine_airlines,
  private_jet_services,
  planned,
  pm_hotel_group,
  posadas,
  pothos,
  predictx_ltd,
  preferred_hotels_and_resorts,
  premier_luxury_car_service,
  prime_numbers_technology,
  prince_waikiki_prince_hotels_japan,
  red_roof,
  reed_and_mackay_travel,
  reloquest,
  rma_worldwide_chauffeured_transportation,
  sabre,
  sanctuary_hotel_new_york_and_hotel_hugo,
  scandinavian_airlines_3,
  saudia,
  sentral,
  sertifi,
  shell,
  singapore_airlines,
  sixt_se,
  skyteam_delta_partners,
  sonesta,
  southwest_airlines,
  spotnana,
  ssn_hotels,
  aka_hotels_and_hotel_residences,
  stayapt_suites,
  level_hotels_and_furnished_suites,
  staypineapple,
  stay_sojo,
  sunnys_limousine,
  synergy_global_housing,
  taxback_international,
  ascott_international_management_2001_pte,
  blueground,
  the_parking_spot,
  the_whitehall_hotel_chicago,
  the_zetter,
  thon_hotels,
  thrust_carbon_ltd,
  tmcon,
  townsend_hotel,
  u_s_bank_travelbank,
  travel_incorporated,
  travelport,
  travelution_dmc,
  trip_biz,
  tripkicks,
  tripstax_technologies,
  trondent_development,
  troop_travel,
  transportation_security_administration,
  turkish_airlines,
  uatp,
  united_airlines,
  unlocked_data,
  china_eastern_airlines,
  u_s_sedan_service_worldwide,
  valencia_hotel_collection,
  vat_it,
  vindow,
  virgin_atlantic_airways,
  visa,
  accelya,
  the_walker_hotels,
  wallypark_airport_parking,
  warwick_hotels_and_resorts,
  wex,
  wheels_up,
  wordly,
  world_travel,
  world_travel_protection,
  wwstay,
  air_france_2,
  wyndham_hotels_and_resorts,
  xiamen_airlines,
  yotel,
  zeno_by_serko,
  zoho,
  carey,
  lowes,
  asana,
  sixt,
};

export const untypedReceipts = {
  rideshare: rideshare_receipt,
  rideshare_polyline: rideshare_polyline_receipt,
  lodging: lodging_receipt,
  flight: flight_receipt,
  redeye: redeye_receipt,
  flight_multileg: flight_multileg_receipt,
  subscription: subscription_receipt,
  simple: simple_receipt,
  car_rental: car_rental_receipt,
  ecommerce: ecommerce_receipt,
  rail: rail_receipt,
};

export const untypedReceivers = {
  brex,
  ramp,
  navan,
  acme,
  traxo,
  chrome_river,
  airbase,
};

export const senders: Record<keyof typeof untypedSenders, Org> = untypedSenders;
export const receivers: Record<keyof typeof untypedReceivers, DemoReceiver> =
  untypedReceivers;
export const receipts: Record<keyof typeof untypedReceipts, Receipt> =
  untypedReceipts as any;

/** LTS */

import flight_1_5_1 from "./receipts/1.5.1/flight.json";
import simple_1_5_1 from "./receipts/1.5.1/simple.json";

export const v1_5_1 = {
  flight: flight_1_5_1,
  simple: simple_1_5_1,
};

import flight_1_6_0 from "./receipts/1.6.0/flight.json";
import simple_1_6_0 from "./receipts/1.6.0/simple.json";

export const v1_6_0 = {
  flight: flight_1_6_0,
  simple: simple_1_6_0,
};

import flight_1_7_0 from "./receipts/1.7.0/flight.json";

export const v1_7_0 = {
  flight: flight_1_7_0,
};
