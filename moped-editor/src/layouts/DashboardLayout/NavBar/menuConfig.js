import React from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import BarChart from "@mui/icons-material/BarChart";

/**
 * Configuration for help menu items we iterate to render menu items in DropdownMenu and MobileDropdownMenu
 * @property {string} linkType - "internal" or "external" to determine how to render link
 * @property {string} link - external href or internal route
 * @property {string} title - Text to display for menu item
 * @property {JSX.Element} Icon - Icon to display for menu item in place of the default OpenInNewIcon
 */
export const helpItems = [
  {
    linkType: "external",
    link: "https://atd.knack.com/dts#new-service-request/?view_249_vars=%7B%22field_399%22%3A%22Moped%22%7D",
    title: "Contact support",
    Icon: <MailOutlineIcon fontSize="small" />,
  },
  {
    linkType: "external",
    link: "https://atd-dts.gitbook.io/moped-documentation/user-guides/getting-started",
    title: "User guides ",
    Icon: <MenuBookOutlined fontSize="small" />,
  },
  {
    linkType: "external",
    link: "https://cityofaustin.sharepoint.com/sites/MopedWorkgroupDocumentation",
    title: "Workgroup guides",
    Icon: <MenuBookOutlined fontSize="small" />,
  },
  {
    linkType: "external",
    link: "https://teams.microsoft.com/l/channel/19%3ab1179ddfc92d44ea9abb23db713eb60c%40thread.tacv2/General?groupId=54a90854-d3fa-4053-9173-5352715bab37&tenantId=5c5e19f6-a6ab-4b45-b1d0-be4608a9a67f",
    title: "Microsoft Teams",
    Icon: <ChatOutlinedIcon fontSize="small" />,
  },
  {
    linkType: "internal",
    link: "/moped/dev/lookups",
    title: "Data dictionary",
    Icon: <MenuBookOutlined fontSize="small" />,
  },
];

export const analysisItems = [
  {
    linkType: "external",
    link: "https://austin.maps.arcgis.com/apps/webappviewer/index.html?id=404d31d56b57491abe53ccfd718fcaee",
    title: "Analyze in AGOL",
    Icon: <MapOutlinedIcon fontSize="small" />,
  },
  {
    linkType: "external",
    link: "https://atd-dts.gitbook.io/moped-documentation/product-management/integrations/power-bi",
    title: "Analyze in Power BI",
    Icon: <BarChart fontSize="small" />,
  },
];
