import { UserType } from "../types/AuthTypes";

export const UserRole = {
    Admin: 0,
    Editor: 1,
};
/*
  Menu Types:
  "menu-default", "menu-sub-hidden", "menu-hidden"
  */
export const defaultMenuType = "menu-default";

export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;
export const defaultLocale = "en";
export const localeOptions = [
    { id: "en", name: "English - LTR", direction: "ltr" },
    { id: "es", name: "Español", direction: "ltr" },
    { id: "enrtl", name: "English - RTL", direction: "rtl" },
];
export const currentUser:UserType = {
    id: 1,
    title: "Sarah Kortney",
    img: "/static/img/profiles/l-1.jpg",
    date: "Last seen today 15:24",
    role: UserRole.Admin,
};

export const adminRoot = "/";
export const searchPath = `${adminRoot}/#`;

export const themeColorStorageKey = "__theme_selected_color";
export const isMultiColorActive = true;
export const defaultColor = "light.blueyale";
export const isDarkSwitchActive = true;
export const defaultDirection = "ltr";
export const themeRadiusStorageKey = "__theme_radius";
export const isAuthGuardActive = false;
export const colors = [
    "bluenavy",
    "blueyale",
    "blueolympic",
    "greenmoss",
    "greenlime",
    "purplemonster",
    "orangecarrot",
    "redruby",
    "yellowgranola",
    "greysteel",
];
