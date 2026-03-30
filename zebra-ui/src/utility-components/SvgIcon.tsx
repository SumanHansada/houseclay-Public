"use client";
export interface IconProps {
  name: string;
  size?: number | `${number}`;
  className?: string;
  color?: string;
  showBlurPlaceholder?: boolean;
  blurDataUrl?: string;
  [key: string]: unknown;
}

export type IconSize = "small" | "medium" | "large";

// Type for medium icon file paths
type MediumIconPath = string;

// components/SvgIcon.tsx
import Image from "next/image";
import React, { memo, Suspense, useEffect, useRef, useState } from "react";

// Small icons configuration (inlined, < 2KB each)
const SMALL_ICONS = {
  "24x7-power": `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 29" fill="none">
    <path fill="#222" stroke="#fff" stroke-width=".25" d="M15.682 23.74h-12.6a.84.84 0 0 1-.84-.84V3.58a.84.84 0 0 1 .84-.84h12.6a.84.84 0 0 1 .84.84V22.9a.84.84 0 0 1-.84.84Zm-11.76-1.68h10.92V4.42H3.922z"/>
    <path fill="#222" stroke="#fff" stroke-width=".25" d="M9.381 9.46c-1.158 0-2.1-.942-2.1-2.1s.942-2.1 2.1-2.1 2.1.942 2.1 2.1-.941 2.1-2.1 2.1Zm0-2.52a.42.42 0 0 0 0 .84.42.42 0 0 0 0-.84ZM6.442 22.06h-.84a.84.84 0 1 1 0-1.68h.84a.84.84 0 1 1 0 1.68ZM13.164 22.06h-.84a.84.84 0 1 1 0-1.68h.84a.84.84 0 1 1 0 1.68ZM9.805 22.06h-.84a.84.84 0 1 1 0-1.68h.84a.84.84 0 1 1 0 1.68ZM24.083 9.46h-1.68a.84.84 0 0 1-.84-.84V6.94a.84.84 0 0 1 .84-.84h1.68a.84.84 0 0 1 .84.84v1.68a.84.84 0 0 1-.84.84Z"/>
    <path fill="#222" stroke="#fff" stroke-width=".25" d="M24.083 14.5h-1.68a.84.84 0 0 1-.752-.464l-.84-1.68a.84.84 0 0 1-.088-.376V9.46a.84.84 0 0 1 .84-.84h3.36a.84.84 0 0 1 .84.84v2.52c0 .13-.03.26-.089.376l-.84 1.68a.84.84 0 0 1-.751.464Zm-1.161-1.68h.642l.519-1.039V10.3h-1.68v1.481z"/>
    <path fill="#222" stroke="#fff" stroke-width=".25" d="M21.564 26.26h-6.72c-1.39 0-2.52-1.13-2.52-2.52a.84.84 0 1 1 1.68 0c0 .463.377.84.84.84h6.72a.84.84 0 0 0 .84-.84V14.5a.84.84 0 1 1 1.68 0v9.24c0 1.39-1.13 2.52-2.52 2.52ZM8.121 18.7a.84.84 0 0 1-.594-1.434l1.559-1.559-1.23-.41a.84.84 0 0 1-.329-1.391l2.52-2.52a.84.84 0 1 1 1.188 1.188l-1.558 1.558 1.23.411a.84.84 0 0 1 .328 1.39l-2.52 2.52a.84.84 0 0 1-.594.247Z"/></svg>`,
  balcony: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <path fill="#878787" stroke="#878787" stroke-width=".35" d="M19.27 18.539h-.244v-4.385h.243a.731.731 0 0 0 0-1.462h-2.192V3.68A2.68 2.68 0 0 0 14.397 1H6.603a2.68 2.68 0 0 0-2.68 2.68v9.012H1.731a.731.731 0 0 0 0 1.462h.243v4.384h-.243a.731.731 0 0 0 0 1.462h17.538a.731.731 0 0 0 0-1.462ZM5.384 3.678a1.22 1.22 0 0 1 1.218-1.217h7.794a1.22 1.22 0 0 1 1.218 1.217v9.013H5.385zm.487 14.86H3.436v-4.385h2.436zm3.897 0H7.333v-4.385H9.77zm3.898 0H11.23v-4.385h2.436zm3.897 0h-2.436v-4.385h2.436z"/>
</svg>`,
  wifi: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 29">
    <path fill="#222" d="M14 18.289a3.21 3.21 0 1 1 .001 6.422 3.21 3.21 0 0 1 0-6.422m0 1.75a1.461 1.461 0 1 0 .001 2.922 1.461 1.461 0 0 0 0-2.922m0-6.414a7.88 7.88 0 0 1 7.036 4.34l-1.321 1.321a6.125 6.125 0 0 0-11.428 0l-1.321-1.32A7.88 7.88 0 0 1 14 13.625m0-4.664a12.53 12.53 0 0 1 10.448 5.6l-1.268 1.26a10.79 10.79 0 0 0-18.358 0l-1.269-1.268a12.53 12.53 0 0 1 10.448-5.6zm0-4.672A17.16 17.16 0 0 1 27.79 11.2l-1.25 1.26a15.436 15.436 0 0 0-25.078 0l-1.251-1.25A17.15 17.15 0 0 1 14 4.297z"/>
</svg>`,
  "build-up-area": `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 19">
    <path fill="#878787" d="M7.693.44c-1.6 0-2.911 1.311-2.911 2.91 0 .755.3 1.44.776 1.96L3.17 10.13c-.087-.007-.17-.026-.259-.026A2.92 2.92 0 0 0 0 13.015c0 1.6 1.312 2.912 2.911 2.912a2.91 2.91 0 0 0 2.41-1.298l11.966 1.757c.33 1.244 1.458 2.176 2.802 2.176 1.6 0 2.911-1.312 2.911-2.911 0-1.55-1.234-2.821-2.765-2.9l-1.567-4.889a2.9 2.9 0 0 0 1.111-2.266c0-1.6-1.311-2.913-2.91-2.913a2.92 2.92 0 0 0-2.432 1.322l-3.872-1.06C10.364 1.538 9.154.44 7.693.44m0 1.475c.803 0 1.438.633 1.438 1.436a1.427 1.427 0 0 1-1.438 1.437 1.425 1.425 0 0 1-1.436-1.437c0-.803.634-1.436 1.436-1.436m9.175 2.244c.803 0 1.436.635 1.436 1.437 0 .803-.633 1.436-1.436 1.436a1.425 1.425 0 0 1-1.437-1.436 1.426 1.426 0 0 1 1.437-1.437m-6.684.672 3.8 1.04c.142 1.468 1.374 2.63 2.876 2.634l1.533 4.794a2.96 2.96 0 0 0-.92 1.115v.022l-.006.055-.424-.062.356-2.43-.94-.136-.357 2.427-1.436-.21.357-2.43-.942-.138-.356 2.43-1.437-.212.494-3.374-.939-.14-.497 3.375-1.437-.21.356-2.43-.941-.136-.356 2.427-1.436-.211.356-2.428-.94-.139-.357 2.43-.791-.117.01-.043-.018-.002a2.9 2.9 0 0 0-.871-1.81l2.328-4.704c.146.023.292.046.444.046a2.91 2.91 0 0 0 2.491-1.433m-7.273 6.747a1.426 1.426 0 0 1 1.438 1.437 1.427 1.427 0 0 1-1.438 1.438 1.43 1.43 0 0 1-1.438-1.437 1.427 1.427 0 0 1 1.438-1.438m17.178 2.636a1.43 1.43 0 0 1 1.438 1.437c0 .803-.636 1.434-1.438 1.434a1.424 1.424 0 0 1-1.438-1.434 1.43 1.43 0 0 1 1.438-1.437"/>
</svg>`,
  "call-with-captain": `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 29 29">
    <path fill="#066c33" fill-rule="evenodd" d="M16.828 8.804a3.36 3.36 0 0 1 3.365 3.365.907.907 0 0 0 1.813 0 5.17 5.17 0 0 0-5.178-5.178.907.907 0 0 0 0 1.813" clip-rule="evenodd"/>
    <path fill="#066c33" fill-rule="evenodd" d="M16.832 4.531a7.57 7.57 0 0 1 5.401 2.233 7.57 7.57 0 0 1 2.233 5.401.906.906 0 0 0 1.813.009 9.37 9.37 0 0 0-2.765-6.69 9.37 9.37 0 0 0-6.69-2.765.907.907 0 0 0 .008 1.812M15.62 20.038a20.4 20.4 0 0 1-6.662-6.66c.568-.68 1.587-1.904 2.17-2.604a2.11 2.11 0 0 0 .371-2.043c-.584-1.708-.913-3.42-.944-5.134A2.113 2.113 0 0 0 8.44 1.51h-4.75c-1.123 0-2.05.878-2.112 1.999l-.071 1.324c0 12.504 10.152 22.657 22.656 22.657l1.324-.072a2.115 2.115 0 0 0 1.999-2.112c0-1.288 0-3.375-.007-4.711a2.107 2.107 0 0 0-2.141-2.103c-1.676.014-3.352-.307-5.027-.95a2.12 2.12 0 0 0-2.115.347zm-.754 1.664.002.002c.551.33 1.251.276 1.744-.135l2.744-2.285c.085-.07.2-.09.303-.05l.004.001q2.844 1.092 5.69 1.07h.013a.3.3 0 0 1 .213.083.3.3 0 0 1 .088.212v.005c.007 1.334.007 3.415.007 4.701 0 .16-.125.294-.285.302l-1.25.069C12.662 25.664 3.343 16.351 3.32 4.873l.07-1.265a.3.3 0 0 1 .301-.285H8.44c.166 0 .3.134.302.3v.008c.035 1.897.395 3.793 1.043 5.69l.001.004c.035.099.015.209-.053.29h-.001c-.632.763-1.781 2.142-2.305 2.77a1.51 1.51 0 0 0-.135 1.744l.003.004a22.2 22.2 0 0 0 7.57 7.569" clip-rule="evenodd"/>
</svg>`,
  clubhouse: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 29">
    <g fill="#191919" stroke="#191919" stroke-width=".25" clip-path="url(#a)">
        <path d="M20.796 20.93a1.4 1.4 0 0 0-1.901-.539l-3.197 1.782-1.071-1.912 2.78-4.962a.547.547 0 1 0-.954-.535L14 19.142l-2.453-4.378a.547.547 0 0 0-.954.535l2.78 4.962-1.071 1.912-3.197-1.782a1.4 1.4 0 0 0-1.9.538l-.657 1.17a1.4 1.4 0 0 0 .54 1.9l1.868 1.041a2.616 2.616 0 0 0 3.556-1.003L14 21.38l1.489 2.657a2.616 2.616 0 0 0 3.555 1.003l1.87-1.04a1.4 1.4 0 0 0 .538-1.901zm-9.238 2.572c-.41.73-1.337.991-2.07.583l-1.867-1.04a.303.303 0 0 1-.119-.41l.658-1.172a.307.307 0 0 1 .413-.117l3.194 1.781zm8.823-.458-1.87 1.04a1.524 1.524 0 0 1-2.068-.581l-.21-.376 3.194-1.78a.31.31 0 0 1 .414.117l.657 1.169a.303.303 0 0 1-.117.411ZM14.09 13.296a2.351 2.351 0 0 0 1.667-4.014 2.363 2.363 0 0 0-3.332 0 2.33 2.33 0 0 0-.69 1.663 2.351 2.351 0 0 0 2.356 2.35Zm-.893-3.24c.247-.246.57-.369.894-.369a1.26 1.26 0 0 1 1.263 1.258c0 .336-.131.652-.37.89a1.27 1.27 0 0 1-1.787 0 1.25 1.25 0 0 1-.369-.89c0-.336.131-.651.37-.89ZM12.695 1.373Z"/>
        <path d="M27.988 12.397a2.06 2.06 0 0 0-.758-1.394l-11.924-9.63a2.06 2.06 0 0 0-2.612 0L.77 11.003c-.431.348-.7.843-.758 1.394a2.06 2.06 0 0 0 .451 1.523c.41.504 1.01.766 1.616.766.459 0 .92-.15 1.304-.46l.44-.355v13.676c0 .302.244.547.547.547h19.26a.547.547 0 0 0 .547-.547V13.87l.44.355c.89.718 2.2.58 2.92-.306.35-.43.51-.971.451-1.523ZM4.916 27V12.987l9.085-7.337 9.083 7.338V27zM26.69 13.23a.99.99 0 0 1-1.385.145l-10.96-8.853a.55.55 0 0 0-.687 0L2.696 13.375a.99.99 0 0 1-1.384-.145.97.97 0 0 1-.213-.718.97.97 0 0 1 .358-.658l11.924-9.63a.98.98 0 0 1 1.238 0l11.924 9.63a.97.97 0 0 1 .358.658.97.97 0 0 1-.212.718Z"/>
    </g>
    <defs>
        <clipPath id="a">
            <path fill="#fff" d="M0 .5h28v28H0z"/>
        </clipPath>
    </defs>
</svg>
`,
  connects: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40">
    <g clip-path="url(#a)">
        <rect width="40" height="40" fill="#fff" rx="20"/>
        <g fill="none" stroke="#fff" stroke-width=".78" clip-path="url(#b)">
            <path d="m19.567 16.763-1.308-1.264c-.912.888-1.428 2.012-1.507 3.14a4.1 4.1 0 0 0 .227 1.67c.192.536.508 1.04.944 1.46l2.093 2.023 1.452 1.403 1.553 1.5c.435.422.955.727 1.51.913.832.28 1.737.297 2.602.082a5.27 5.27 0 0 0 2.385-1.33c.919-.889 1.437-2.017 1.516-3.149a4.1 4.1 0 0 0-.226-1.67 3.8 3.8 0 0 0-.944-1.46l-5.097-4.926a4 4 0 0 0-1.51-.913 4.67 4.67 0 0 0-2.603-.082c-.29.072-.578.174-.857.298l1.451 1.402q.203-.04.404-.054c.353-.022.692.021.997.124q.459.153.81.488l5.098 4.927q.348.34.506.783c.16.441.18.96.04 1.483a3.24 3.24 0 0 1-.892 1.486c-.61.589-1.368.901-2.075.946a2.6 2.6 0 0 1-.997-.122 2.14 2.14 0 0 1-.812-.489l-1.323-1.279-1.308-1.263-2.466-2.384a2 2 0 0 1-.505-.784c-.16-.441-.18-.96-.04-1.483.137-.518.43-1.036.882-1.476Z"/>
            <path d="m21.697 22.889 1.307 1.263c.913-.888 1.429-2.012 1.508-3.14a4.1 4.1 0 0 0-.226-1.67 3.8 3.8 0 0 0-.945-1.46l-2.093-2.023-1.451-1.402-1.553-1.501a4 4 0 0 0-1.51-.913 4.66 4.66 0 0 0-2.603-.081 5.3 5.3 0 0 0-2.385 1.329c-.92.89-1.438 2.017-1.517 3.15-.04.565.033 1.134.226 1.67.192.535.509 1.038.945 1.459l5.098 4.927a4 4 0 0 0 1.51.912c.833.28 1.737.296 2.602.082q.438-.11.857-.297l-1.451-1.402a3 3 0 0 1-.403.053 2.6 2.6 0 0 1-.998-.122 2.15 2.15 0 0 1-.81-.489l-5.098-4.927a2.04 2.04 0 0 1-.506-.784c-.16-.441-.18-.96-.04-1.483a3.24 3.24 0 0 1 .893-1.485c.609-.59 1.367-.902 2.074-.947.354-.023.693.02.998.123q.458.153.81.488l1.324 1.28 1.308 1.263 2.466 2.384q.348.339.506.783c.16.442.18.96.04 1.483a3.24 3.24 0 0 1-.883 1.476Z"/>
        </g>
    </g>
    <defs>
        <clipPath id="a">
            <rect width="40" height="40" fill="#fff" rx="20"/>
        </clipPath>
        <clipPath id="b">
            <path fill="#fff" d="M10.219 11.816h20.826v16.02H10.219z"/>
        </clipPath>
    </defs>
</svg>
`,
  "create-new-listing": `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28">
    <g fill="#154e8d" clip-path="url(#a)">
        <path d="M27.616 21.165a.657.657 0 0 0-.06-.927l-.84-.738v-3.245a2.084 2.084 0 0 0-4.132-.389l-.718-.631a2.214 2.214 0 0 0-2.915 0l-5.687 5.003a.654.654 0 0 0 .837 1.003V25.9a1.883 1.883 0 0 0 1.881 1.881h8.855a1.88 1.88 0 0 0 1.88-1.881v-4.66a.65.65 0 0 0 .899-.075m-3.763-4.91a.773.773 0 1 1 1.546 0v2.09l-1.546-1.359zm-2.292 10.212h-2.188v-1.53a.97.97 0 0 1 .971-.97h.25a.97.97 0 0 1 .97.97zm3.675-.167a.56.56 0 0 1-.402.167h-1.96v-1.53a2.287 2.287 0 0 0-2.285-2.283h-.25a2.286 2.286 0 0 0-2.283 2.284v1.527H15.98a.57.57 0 0 1-.569-.569v-5.8l4.407-3.875a.9.9 0 0 1 1.182 0l4.404 3.872V25.9a.56.56 0 0 1-.166.4z"/>
        <path d="M20.411 17.588a1.942 1.942 0 1 0-.001 3.884 1.942 1.942 0 0 0 .001-3.885m0 2.57a.63.63 0 1 1-.001-1.255.63.63 0 0 1 .001 1.253zM3.306 27.778h8.054a.656.656 0 1 0 0-1.313H3.306A1.77 1.77 0 0 1 1.53 24.7V5.981a1.767 1.767 0 0 1 1.775-1.755h2.88v.864a.656.656 0 0 0 .656.656h8.16a.656.656 0 0 0 .657-.656v-.864h2.88a1.766 1.766 0 0 1 1.774 1.755v5.994a.656.656 0 0 0 1.313 0V5.981a3.08 3.08 0 0 0-3.087-3.067H15.65A2.764 2.764 0 0 0 12.894.22H8.95a2.765 2.765 0 0 0-2.758 2.694H3.306A3.08 3.08 0 0 0 .219 5.98v18.72a3.086 3.086 0 0 0 3.087 3.077M7.498 2.986A1.455 1.455 0 0 1 8.95 1.533h3.944a1.454 1.454 0 0 1 1.454 1.453v1.448h-6.85z"/>
        <path d="M17.356 10.209a.657.657 0 0 0-.657-.657H5.15a.656.656 0 1 0 0 1.313h11.55a.657.657 0 0 0 .657-.656M6.977 14.467h7.9a.657.657 0 0 0 0-1.312h-7.9a.656.656 0 1 0 0 1.312"/>
    </g>
    <defs>
        <clipPath id="a">
            <path fill="#fff" d="M0 0h28v28H0z"/>
        </clipPath>
    </defs>
</svg>
`,
  "faster-deal-closures": `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 29 29">
    <path fill="#154e8d" d="M25.71 12.177c1.773-1.552 2.026-4.297.314-6.007a4.04 4.04 0 0 0-5.7 0l-.043.043a12.1 12.1 0 0 0-3.374-1.22V3.662h.595a.62.62 0 0 0 .62-.62V.62a.62.62 0 0 0-.62-.62h-5.715a.62.62 0 0 0-.62.62v2.422c0 .342.278.62.62.62h.596v1.276c-1.304.23-2.536.666-3.661 1.275l-.044-.043a4.04 4.04 0 0 0-5.699 0c-1.713 1.71-1.459 4.455.314 6.007a12 12 0 0 0-.952 4.7C2.341 23.562 7.796 29 14.501 29c6.623 0 12.16-5.492 12.16-12.123 0-1.666-.338-3.254-.951-4.7m-1.252 5.288h.948a10.82 10.82 0 0 1-2.706 6.593l-.68-.644a.62.62 0 0 0-.851.9l.66.626a10.9 10.9 0 0 1-6.603 2.796v-.933a.62.62 0 0 0-1.24 0v.945a10.9 10.9 0 0 1-6.66-2.672l.7-.7a.62.62 0 0 0-.877-.876l-.71.71a10.83 10.83 0 0 1-2.836-6.64H4.65a.62.62 0 1 0 0-1.24H3.594A10.82 10.82 0 0 1 6.35 9.645l.726.726q.438.363.876 0a.62.62 0 0 0 0-.877l-.725-.725a10.9 10.9 0 0 1 6.656-2.757v.982a.62.62 0 1 0 1.24 0v-.982a10.9 10.9 0 0 1 6.612 2.719l-.664.702a.62.62 0 0 0 .024.876q.444.35.877-.025l.645-.682a10.82 10.82 0 0 1 2.786 6.625h-.944a.62.62 0 0 0 0 1.24m.69-10.419c1.12 1.12.97 2.831-.014 3.954a12.2 12.2 0 0 0-3.756-4.116 2.797 2.797 0 0 1 3.77.162M12.407 1.24h4.476v1.183h-4.476zm1.215 2.423h2.046V4.81a12 12 0 0 0-2.046-.024zm-9.767 7.325c-1.076-1.075-1.076-2.866 0-3.94a2.797 2.797 0 0 1 3.77-.163A12.2 12.2 0 0 0 3.868 11z"/>
    <path fill="#154e8d" d="m19.623 11.136-3.934 3.929a2.172 2.172 0 0 0-3.361 1.812c0 1.196.974 2.169 2.17 2.169a2.172 2.172 0 0 0 1.993-3.03l4.008-4.003a.62.62 0 1 0-.876-.877m-5.124 6.67a.93.93 0 0 1-.932-.93.932.932 0 0 1 1.863 0c0 .513-.418.93-.931.93"/>
</svg>
`,
  houseclay: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 31 31"><rect width="31" height="31" fill="#ef4a50" rx="4.502"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.125" d="M16.978 20.153h2.584M12.547 20.153h2.215"/><rect width="2.215" height="2.163" x="17.715" y="13.665" fill="#fff" rx="1.081"/><rect width="2.215" height="2.163" x="11.81" y="13.665" fill="#fff" rx="1.081"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.876" d="M12.547 17.48v7.344a.375.375 0 0 1-.375.375H6.279a.375.375 0 0 1-.375-.375V13.303c0-.117.055-.227.147-.298l9.253-7.101a.375.375 0 0 1 .447-.008l9.925 7.11c.099.07.157.184.157.304v11.514a.375.375 0 0 1-.375.375h-5.893a.375.375 0 0 1-.375-.375v-7.343"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 21"><path fill="currentColor" d="M18.33 10.8c0-4.6-3.733-8.333-8.333-8.333A8.336 8.336 0 0 0 1.664 10.8c0 4.034 2.867 7.392 6.667 8.167V13.3H6.664v-2.5h1.667V8.717A2.92 2.92 0 0 1 11.247 5.8h2.084v2.5h-1.667a.836.836 0 0 0-.833.833V10.8h2.5v2.5h-2.5v5.792a8.33 8.33 0 0 0 7.5-8.292"/></svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 21"><path fill="currentColor" d="M10.858 2.467c.938.002 1.414.007 1.825.019l.161.006c.187.006.371.015.594.025.886.041 1.491.181 2.022.387.55.212 1.013.499 1.477.961.424.417.752.92.96 1.477.206.53.346 1.136.388 2.023l.025.593.005.162c.013.41.018.886.02 1.823v1.714q.003.912-.02 1.823l-.004.162-.025.593c-.042.888-.183 1.492-.388 2.024a4.1 4.1 0 0 1-.961 1.476c-.417.424-.92.752-1.477.961-.53.206-1.136.346-2.022.387l-.594.026-.161.004c-.411.012-.887.018-1.825.02H9.146a65 65 0 0 1-1.824-.019l-.162-.005-.593-.026c-.887-.041-1.492-.181-2.024-.387a4.1 4.1 0 0 1-1.475-.96 4.1 4.1 0 0 1-.962-1.477c-.206-.531-.346-1.136-.388-2.024l-.025-.593-.004-.162a66 66 0 0 1-.02-1.823V9.943q-.005-.91.018-1.823l.006-.162c.006-.187.015-.371.025-.593.041-.887.181-1.492.387-2.023.21-.557.539-1.06.963-1.477.416-.424.92-.751 1.475-.96.532-.207 1.136-.347 2.024-.388.221-.01.406-.019.593-.025l.162-.005a66 66 0 0 1 1.823-.02zm-.856 4.166a4.167 4.167 0 1 0 0 8.334 4.167 4.167 0 0 0 0-8.334m0 1.667a2.5 2.5 0 1 1-.001 5 2.5 2.5 0 0 1 .002-5m4.375-2.917a1.042 1.042 0 1 0 0 2.084 1.042 1.042 0 0 0 0-2.084"/></svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 21"><mask id="a" width="16" height="16" x="2" y="3" maskUnits="userSpaceOnUse" style="mask-type:luminance"><path fill="#fff" d="M18 3H2v16h16z"/></mask><g mask="url(#a)"><path fill="currentColor" fill-rule="evenodd" d="M18 19h-3.2v-5.6c0-1.535-.678-2.392-1.893-2.392-1.322 0-2.107.893-2.107 2.393V19H7.6V8.6h3.2v1.17s1.004-1.762 3.266-1.762c2.264 0 3.934 1.38 3.934 4.239zM3.954 6.937A1.96 1.96 0 0 1 2 4.968C2 3.882 2.874 3 3.954 3a1.96 1.96 0 0 1 1.952 1.968 1.96 1.96 0 0 1-1.952 1.969M2 19h4V8.6H2z" clip-rule="evenodd"/></g></svg>`,
  "real-owners": `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 52 52">
    <path fill="#EA3934" d="M16.792 43.277a.677.677 0 0 1-.667-.785.68.68 0 0 1 .268-.44l3.383-2.414a.64.64 0 0 1 .392-.129h9.47l16.067-6.907a1.677 1.677 0 0 0-.995-3.186L28.367 32.69a.689.689 0 1 1-.264-1.353l16.344-3.274a3.038 3.038 0 0 1 1.792 5.764l-16.181 6.98a.7.7 0 0 1-.264.055h-9.437l-3.152 2.286a.68.68 0 0 1-.413.13"/>
    <path fill="#EA3934" d="M25.774 33.982h-9.47a.676.676 0 1 1 0-1.353h9.47a2.27 2.27 0 0 0 1.9-.994c.272-.398.414-.87.406-1.353 0-1.062-.777-1.603-2.306-1.603H17.29a4.9 4.9 0 0 0-1.664.284c-2.706.954-4.607 2.192-5.926 3.802a.676.676 0 1 1-1.042-.86c1.475-1.799 3.605-3.179 6.508-4.214a6.3 6.3 0 0 1 2.124-.338h8.483c2.293 0 3.66 1.103 3.66 2.956a3.8 3.8 0 0 1-.643 2.104 3.67 3.67 0 0 1-3.017 1.57"/>
    <path fill="#EA3934" d="M13.78 47.992h-.121a1.9 1.9 0 0 1-1.407-.764l-7.955-10.73a1.91 1.91 0 0 1 .162-2.462l2.3-2.367a1.88 1.88 0 0 1 1.488-.575 1.9 1.9 0 0 1 1.407.764l7.956 10.709a1.91 1.91 0 0 1-.156 2.455l-2.28 2.382a1.88 1.88 0 0 1-1.393.588M8.126 32.433a.54.54 0 0 0-.399.17l-2.293 2.374a.55.55 0 0 0-.047.676l7.955 10.763a.51.51 0 0 0 .406.216.56.56 0 0 0 .433-.162l2.293-2.388a.55.55 0 0 0 .047-.676L8.565 32.663a.56.56 0 0 0-.406-.223zM44.895 17.26a.64.64 0 0 1-.412-.142L29.54 5.544 14.59 17.118a.68.68 0 0 1-1.074-.352.68.68 0 0 1 .242-.717L29.12 4.15a.68.68 0 0 1 .832 0l15.363 11.9a.676.676 0 0 1-.42 1.21"/>
    <path fill="#EA3934" d="M16.88 28.706a.676.676 0 0 1-.677-.677V14.581a.677.677 0 0 1 1.353 0V28.03a.676.676 0 0 1-.676.677M42.239 29.903a.677.677 0 0 1-.676-.676V14.58a.677.677 0 0 1 1.352 0v14.646a.676.676 0 0 1-.676.676M30.528 32.237a.676.676 0 0 1-.676-.676v-7.59a4.525 4.525 0 0 1 9.044 0v6.027a.676.676 0 1 1-1.353 0V23.97a3.173 3.173 0 0 0-3.166-3.166 3.186 3.186 0 0 0-3.173 3.166v7.59a.677.677 0 0 1-.676.676M29.536 12.47a2.335 2.335 0 1 1-.013-4.669 2.335 2.335 0 0 1 .013 4.67m0-3.307a.981.981 0 1 0 .974.98.98.98 0 0 0-.974-.994zM39.318 12.944a.68.68 0 0 1-.42-.142l-2.814-2.185a.68.68 0 0 1-.264-.534V4.67a.677.677 0 0 1 .677-.677h2.82a.676.676 0 0 1 .677.677v7.597a.676.676 0 0 1-.676.676m-2.145-3.18 1.468 1.137v-5.54h-1.468z"/>
    <path fill="#EA3934" d="M40.629 5.36h-5.453a.677.677 0 0 1 0-1.352h5.453a.677.677 0 0 1 0 1.353"/>
</svg>`,
  "instant-access": `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 52 52">
    <path fill="currentColor" d="M33.839 29.371a3.783 3.783 0 0 0 2.37 6.742 3.785 3.785 0 1 0-2.37-6.739zm3.75 4.688a2.22 2.22 0 1 1 .346-3.121 2.204 2.204 0 0 1-.346 3.122z"/>
    <path fill="currentColor" d="M33.352 3.388a2.85 2.85 0 0 0-4.006 0l-8.403 8.417a2.8 2.8 0 0 0-.838 1.989 2.82 2.82 0 0 0 .833 2.02l4.41 4.409a9.32 9.32 0 0 0-5.785 4.279l-9.234-.313a.8.8 0 0 0-.56.21l-4.7 4.393a.78.78 0 0 0-.038 1.104l3.376 3.615c.14.15.335.24.54.248l2.384.092a.78.78 0 0 0 .812-.757l.042-1.427 1.11.038-.066 1.88a.78.78 0 0 0 .752.81l2.834.105a.78.78 0 0 0 .81-.752l.063-1.724.95.033a9.36 9.36 0 0 0 3.721 5.024l-5.03 4.022a.78.78 0 0 0-.29.524l-.712 6.394a.78.78 0 0 0 .691.86l4.927.546a.78.78 0 0 0 .574-.166l1.858-1.484a.78.78 0 0 0 .122-1.099l-.893-1.117.866-.692 1.18 1.475a.78.78 0 0 0 1.097.123l2.22-1.767a.78.78 0 0 0 .122-1.098l-1.075-1.346.744-.596a9.375 9.375 0 0 0 12.353-13.763A9.6 9.6 0 0 0 40 26.737l6.36-6.346a2.85 2.85 0 0 0-.005-4zM20 31.114a.78.78 0 0 0-.733-.598l-2.304-.078a.78.78 0 0 0-.808.752l-.064 1.719-1.273-.048.066-1.882a.783.783 0 0 0-.754-.809l-2.675-.093a.782.782 0 0 0-.808.758l-.043 1.424-1.274-.05L6.703 29.4l3.894-3.642 9.383.32a.77.77 0 0 0 .716-.413 7.783 7.783 0 0 1 12.932-1.282 9.356 9.356 0 0 0-9.077 10.946l-.895.717A7.8 7.8 0 0 1 20 31.114m21.556 3.505a7.81 7.81 0 0 1-12.374 5.444.78.78 0 0 0-.948.019l-1.806 1.441a.78.78 0 0 0-.123 1.098l1.076 1.348-.997.796-1.18-1.476a.78.78 0 0 0-1.093-.123l-2.086 1.668a.78.78 0 0 0-.123 1.099l.894 1.117-.999.794-3.828-.427.59-5.295 7.338-5.868a.78.78 0 0 0 .275-.781 7.811 7.811 0 0 1 13.297-7.09 7.81 7.81 0 0 1 2.087 6.236m3.696-15.33-6.518 6.504a9.3 9.3 0 0 0-3.08-1.227 9.36 9.36 0 0 0-7.726-4.618c-.21-.006-.415.015-.625.022l-5.262-5.261a1.27 1.27 0 0 1-.277-1.39c.064-.153.16-.29.278-.406l8.405-8.416a1.28 1.28 0 0 1 1.803-.005l13 13.003a1.28 1.28 0 0 1 .002 1.795"/>
</svg>`,
  "curly-arrow": `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 70">
    <g fill="#EA3934" clip-path="url(#a)">
        <path d="M4.876 36.736a33 33 0 0 0 3.285-3.793c.5-.671 1.216-1.26 1.784-1.782.608-.63 1.176-1.152 1.784-1.782 2.46-2.264 4.878-4.42 7.62-6.453 5.148-3.826 10.74-6.87 16.938-8.58 5.968-1.428 12.325-1.603 18.127.345 6.125 2.07 11.572 6.586 13.561 12.742.915 2.802 1.235 5.871.61 8.828-.665 3.065-2.194 5.803-4.29 8.081-2.094 2.279-4.688 4.246-7.619 5.471-1.486.667-3.106 1.036-4.78.895-1.632-.249-3.129-1.183-3.991-2.492-1.441-2.387-.304-5.396 1.238-7.515 1.582-2.227 3.73-3.994 5.973-5.357 4.633-2.792 10.438-3.79 15.674-3.284 5.858.495 11.24 2.898 15.919 6.51 4.854 3.8 8.748 8.835 11.454 14.402.27.593.606 1.335.835 2.035.093.404.228.7.322 1.105.094.404.188.808.323 1.104.228.7-.812 1.167-1.04.467-.27-.593-.755-1.268-1.024-1.861-.377-.634-.754-1.268-1.09-2.01a38 38 0 0 0-2.196-3.654 43.6 43.6 0 0 0-5.323-6.803c-3.828-3.904-8.561-7.044-13.945-8.466-4.696-1.284-10.027-1.212-14.726.45-2.296.851-4.524 1.851-6.443 3.337-1.919 1.485-3.81 3.226-4.448 5.564-.366.967-.367 1.95.145 2.88.687 1.12 2.13 1.542 3.372 1.52 1.499-.047 2.836-.647 4.065-1.288 1.229-.64 2.39-1.43 3.444-2.259 2.149-1.767 4.095-3.978 5.179-6.517 1.083-2.538 1.477-5.213 1.036-7.96-.91-5.748-5.075-10.393-10.31-12.863-5.125-2.43-10.983-2.925-16.64-1.994-5.696 1.04-11.152 3.398-16.015 6.472-2.621 1.711-5.175 3.57-7.553 5.619-1.243 1.004-2.378 2.048-3.662 3.16-1.135 1.044-2.31 2.196-3.513 3.093-1.243 1.004-2.446 1.9-3.621 3.052-.379.348-1.012-.26-.634-.608z"/>
        <path d="m.002 41.156 2.398-6.34 2.397-6.34.57 7.953 7.867 1.378-6.67 1.654z"/>
    </g>
    <defs>
        <clipPath id="a">
            <path fill="#fff" d="M15.563 0 0 41.156 92.602 76.17l15.562-41.156z"/>
        </clipPath>
    </defs>
</svg>`,
  whatsapp: `<svg viewBox="6.468 5.675999999999999 20.856 20.922" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-height: 500px" width="20.856" height="20.922">
    <path d="M21.809 17.908a83 83 0 0 0-1.76-.832c-.224-.096-.416-.128-.576.128s-.672.832-.8.992c-.16.16-.288.192-.544.064s-1.088-.384-2.08-1.248c-.768-.672-1.28-1.504-1.44-1.76s0-.384.128-.512.256-.288.384-.448.16-.256.256-.416.032-.32-.032-.448-.576-1.376-.8-1.888c-.224-.48-.416-.416-.576-.448h-.48a.92.92 0 0 0-.672.32c-.224.256-.896.864-.896 2.112s.928 2.432 1.056 2.624c.128.16 1.824 2.72 4.384 3.808.608.256 1.088.416 1.472.544.608.192 1.184.16 1.632.096.48-.064 1.536-.608 1.728-1.184.224-.576.224-1.088.16-1.184-.128-.128-.288-.192-.544-.32M16.913 24.5a8.5 8.5 0 0 1-4.32-1.184l-.32-.192-3.2.832.864-3.104-.192-.32a8.5 8.5 0 0 1-1.28-4.48c0-4.64 3.808-8.416 8.48-8.416 2.208 0 4.352.864 5.952 2.464a8.35 8.35 0 0 1 2.464 5.952c0 4.64-3.808 8.448-8.448 8.448m7.2-15.616a10.12 10.12 0 0 0-7.2-2.976c-5.6 0-10.176 4.544-10.176 10.144 0 1.792.48 3.52 1.344 5.056l-1.44 5.248 5.376-1.408c1.472.8 3.168 1.248 4.864 1.248 5.6 0 10.176-4.544 10.176-10.144.032-2.688-1.024-5.248-2.944-7.168" fill="currentColor"/>
</svg>`,
  "houseclay-home": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 20 20">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width=".818" d="M11 14.333h2.333M7 14.333h2"/>
    <rect width="2" height="2" x="11.667" y="8.333" fill="currentColor" rx="1"/>
    <rect width="2" height="2" x="6.334" y="8.333" fill="currentColor" rx="1"/>
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 11.862V18.7a.3.3 0 0 1-.3.3H1.3a.3.3 0 0 1-.3-.3V7.973a.3.3 0 0 1 .115-.235L9.51 1.14a.3.3 0 0 1 .362-.006l9.005 6.603A.3.3 0 0 1 19 7.98V18.7a.3.3 0 0 1-.3.3h-5.4a.3.3 0 0 1-.3-.3v-6.838"/>
</svg>`,
  "list-property": `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="none" viewBox="0 0 38 38">
    <g fill="#c8d892" clip-path="url(#a)">
        <path d="M23.783 31.345v.205A6.56 6.56 0 0 0 30.334 38a6.56 6.56 0 0 0 6.553-6.553 6.56 6.56 0 0 0-6.553-6.552 6.56 6.56 0 0 0-6.551 6.45m10.221-1.01v2.226h-2.555v2.555h-2.227v-2.555h-2.555v-2.227h2.555V27.78h2.227v2.555zM13.562 20.856h7.994v12.035h-7.994zM17.559 5.185l16.445 9.867V9.867L17.559 0 13.56 2.398V0H6.224v6.8l-5.11 3.067v5.185z"/>
        <path d="M11.335 18.63h12.448v6.98a8.76 8.76 0 0 1 7.665-2.871v-6.623l-13.89-8.334-13.89 8.334V32.89h7.667zm0-4.926h12.448v2.226H11.335z"/>
    </g>
    <defs>
        <clipPath id="a">
            <path fill="#fff" d="M0 0h38v38H0z"/>
        </clipPath>
    </defs>
</svg>
`,
  "weekly-standouts": `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="none" viewBox="0 0 38 38">
    <path fill="#f6c874" d="M13.294 7.558c.012-.035.018-.07.03-.106H9.447a3.1 3.1 0 0 0-2.44 1.205l-4.003 5.26c-.293.384-.49.832-.576 1.307h8.699zM11.133 16.411H2.446c.098.473.307.915.612 1.289l13.425 16.625-.066-.22zM21.583 34.1c-.584 1.105 13.478-16.667 13.36-16.4.303-.375.515-.817.617-1.289h-8.693zM30.994 8.657a3.09 3.09 0 0 0-2.44-1.205H24.67q.025.054.042.112l2.161 7.66h8.699a3 3 0 0 0-.576-1.306zM12.374 16.411l5.183 17.35.422 1.4c.132.45.633.456 1.021.464.388-.008.89-.014 1.021-.463l.422-1.401 5.183-17.35zM25.632 15.224c-.122-.441-1.999-7.105-2.066-7.339a.59.59 0 0 0-.57-.433h-7.992c-.6-.024-.643.78-.784 1.187l-1.852 6.585zM10.213 30.887a3.95 3.95 0 0 1-3.1-3.1.594.594 0 0 0-1.164 0 3.95 3.95 0 0 1-3.099 3.1.596.596 0 0 0 0 1.164 3.95 3.95 0 0 1 3.1 3.099.594.594 0 0 0 1.163 0 3.95 3.95 0 0 1 3.1-3.1.597.597 0 0 0 0-1.163M30.163 5.926a2.44 2.44 0 0 1 1.911 1.911.594.594 0 0 0 1.164 0 2.44 2.44 0 0 1 1.912-1.911.596.596 0 0 0 0-1.164 2.44 2.44 0 0 1-1.912-1.912.594.594 0 0 0-1.164 0 2.44 2.44 0 0 1-1.911 1.912.596.596 0 0 0 0 1.164"/>
</svg>
`,
  "find-rooms": `<svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" fill="none" viewBox="0 0 41 41">
    <path fill="#95baee" d="m36.794 21.98-1.281-1.08v-7.38h1.281zm3.514-10.635-2.085-4.871a.65.65 0 0 0-.59-.388h-2.96a.64.64 0 0 0-.585.388l-2.086 4.871a.642.642 0 0 0 .59.894h7.127a.642.642 0 0 0 .59-.894M10.346 18.77v-.685a1.72 1.72 0 0 1 1.717-1.717h4.065a1.72 1.72 0 0 1 1.717 1.717v.685h2.748v-.685a1.72 1.72 0 0 1 1.717-1.717h4.065a1.72 1.72 0 0 1 1.716 1.717v.685h3.3v-3.35a3.54 3.54 0 0 0-3.533-3.533H10.58a3.54 3.54 0 0 0-3.533 3.533v3.35zm25.052 5.382h1.992l-.596-.5-1.281-1.076-3.004-2.524H5.929l-4.882 4.1zM3.523 32.765h-1.28v1.508a.643.643 0 0 0 .64.641h3.12a.643.643 0 0 0 .64-.64v-1.51zm29.553 0h-1.282v1.508a.643.643 0 0 0 .64.641h3.12a.643.643 0 0 0 .641-.64v-1.51zM1.921 25.433H.64v5.41a.643.643 0 0 0 .64.64h35.875a.64.64 0 0 0 .64-.64v-5.41z"/>
</svg>
`,
  "find-flatmates": `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="none" viewBox="0 0 42 42">
    <path fill="#fdbf9a" d="M26.568 19.125C26.531 20.798 21 24.927 21 24.927s-5.53-4.129-5.568-5.802c-4.67.426-8.329 4.353-8.329 9.135 0 4.569 3.339 4.792 7.709 4.792h.31v-.002c.001-1.57.613-3.046 1.723-4.154a5.84 5.84 0 0 1 4.154-1.722c1.57 0 3.045.612 4.154 1.722a5.84 5.84 0 0 1 1.722 4.154v.002h.311c4.371 0 7.71-.223 7.71-4.792a9.173 9.173 0 0 0-8.328-9.135"/>
    <path fill="#fdbf9a" d="M21.002 20.325c4.225 0 7.65-6.352 7.65-10.577a7.65 7.65 0 0 0-7.65-7.648 7.65 7.65 0 0 0-7.648 7.648c0 4.225 3.425 10.577 7.648 10.577M24.656 35.028a4.14 4.14 0 0 0 .499-1.978c0-1.11-.433-2.154-1.217-2.938a4.13 4.13 0 0 0-2.939-1.217c-1.11 0-2.154.432-2.939 1.217a4.13 4.13 0 0 0-1.217 2.938 4.16 4.16 0 0 0 6.134 3.658l2.844 2.843a1.183 1.183 0 0 0 1.68 0 1.187 1.187 0 0 0 0-1.678zm-2.062-.382a2.259 2.259 0 0 1-3.851-1.596c0-.602.234-1.169.66-1.595A2.24 2.24 0 0 1 21 30.794c.603 0 1.169.236 1.595.661.427.426.66.992.66 1.595s-.234 1.17-.66 1.596"/>
</svg>
`,
  deal: `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
    <path fill="#440d0b" d="M11.5 3.034c.307 0 .557-.249.557-.556V.639a.557.557 0 1 0-1.114 0v1.839c0 .307.25.556.557.556M14.098 3.98a.56.56 0 0 0 .393-.164l1.485-1.484a.557.557 0 1 0-.788-.788L13.704 3.03a.557.557 0 0 0 .394.95M8.509 3.816a.555.555 0 0 0 .787 0 .557.557 0 0 0 0-.787L7.812 1.544a.557.557 0 0 0-.788.788zM16.5 7.95l-2.161-2.16a2.23 2.23 0 0 0-1.575-.653h-3.38c-.842 0-1.634.328-2.23.924l-.178.178-.011.011H2.557A.557.557 0 0 0 2 6.807v5.937c0 .308.25.557.557.557h2.775l1.321 1.321a.56.56 0 0 0 .394.163h.504a2.3 2.3 0 0 1-.354-.949 2.368 2.368 0 0 1-.787-4.062L8.525 8h4.225c.147 0 .289.059.393.163l1.555 1.555c.499.499 1.326.51 1.817.002A1.263 1.263 0 0 0 16.5 7.95"/>
    <path fill="#440d0b" d="M21 7.957a.557.557 0 0 0-.556-.556h-2.95c.712.93.644 2.27-.207 3.12a2.36 2.36 0 0 1-1.68.696 2.36 2.36 0 0 1-1.679-.695l-1.409-1.41H8.827l-.438.367-1.412 1.186a1.252 1.252 0 1 0 1.61 1.918 1.252 1.252 0 0 0 1.61 1.92 1.252 1.252 0 1 0 1.61 1.918l.986-.827-.133.111a1.252 1.252 0 0 0 1.61 1.92l3.782-3.174h2.392c.307 0 .556-.249.556-.556z"/>
</svg>
`,
  "verified-tenants": `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
    <path fill="#ea3934" fill-rule="evenodd" stroke="#ea3934" d="M9.09 2.57a2.97 2.97 0 1 0 0 5.94 2.97 2.97 0 0 0 0-5.94ZM6.97 5.54a2.121 2.121 0 1 1 4.242 0 2.121 2.121 0 0 1-4.242 0Z" clip-rule="evenodd"/>
    <path fill="#ea3934" stroke="#ea3934" d="M7.718 10.49A3.72 3.72 0 0 0 4 14.208c0 1.227.994 2.221 2.221 2.221h.678a.424.424 0 0 0 0-.848h-.678a1.373 1.373 0 0 1-1.373-1.373 2.87 2.87 0 0 1 2.87-2.87h2.745a2.87 2.87 0 0 1 2.87 2.87c0 .758-.614 1.373-1.372 1.373h-.678a.424.424 0 1 0 0 .848h.678a2.22 2.22 0 0 0 2.22-2.22 3.72 3.72 0 0 0-3.718-3.72z"/>
    <path fill="#ea3934" stroke="#fff" stroke-width="1.81" d="M14.273 14.786a1.47 1.47 0 0 1-1.085-.384l-1.697-1.555a1.47 1.47 0 1 1 1.988-2.168l.572.524 2.264-2.657a1.47 1.47 0 0 1 2.073-.166zm0 0a1.47 1.47 0 0 0 1.028-.514m-1.028.514 1.028-.514m0 0 3.253-3.818M15.3 14.272l3.253-3.818m0 0a1.47 1.47 0 0 0-.166-2.074z"/>
    <path fill="#ea3934" stroke="#ea3934" stroke-width=".24" d="M14.224 14.003a.69.69 0 0 1-.505-.18l-1.697-1.555a.686.686 0 0 1 .927-1.01l1.172 1.074 2.791-3.277a.686.686 0 0 1 .967-.077l-.078.091c.238.203.267.56.064.798zm0 0a.69.69 0 0 0 .48-.24m-.48.24.48-.24m0 0 3.252-3.818z"/>
</svg>
`,
};

// Medium icons configuration (lazy loaded, 2KB - 20KB)
const MEDIUM_ICONS = {
  "affordable-upgrades": "/optimizedIcons/medium/affordable-upgrades.svg",
  "bbq-grill": "/optimizedIcons/medium/bbq-grill.svg",
  "buyers-connections": "/optimizedIcons/medium/buyers-connections.svg",
  coin: "/optimizedIcons/medium/coin.svg",
  "coin-egg": "/optimizedIcons/medium/coin-egg.svg",
  "connect-with-owners": "/optimizedIcons/medium/connect-with-owners.svg",
  "direct-owner-access": "/optimizedIcons/medium/direct-owner-access.svg",
  "email-verified": "/optimizedIcons/medium/email-verified.svg",
  "exclusive-listings": "/optimizedIcons/medium/exclusive-listings.svg",
  female: "/optimizedIcons/medium/female.svg",
  "hassle-free-listings": "/optimizedIcons/medium/hassle-free-listings.svg",
  "high-rental": "/optimizedIcons/medium/high-rental.svg",
  "houseclay-captain": "/optimizedIcons/medium/houseclay-captain.svg",
  male: "/optimizedIcons/medium/male.svg",
  "my-requirements": "/optimizedIcons/medium/my-requirements.svg",
  "no-forced-plans": "/optimizedIcons/medium/no-forced-plans.svg",
  "owners-contacted": "/optimizedIcons/medium/owners-contacted.svg",
  rent: "/optimizedIcons/medium/rent.svg",
  "smoke-alarm": "/optimizedIcons/medium/smoke-alarm.svg",
  "use-connects": "/optimizedIcons/medium/use-connects.svg",
  "wide-reach": "/optimizedIcons/medium/wide-reach.svg",
  "zero-percent": "/optimizedIcons/medium/zero-percent.svg",
  "zero-percent-red": "/optimizedIcons/medium/zero-percent-red.svg",
  connects: "/optimizedIcons/medium/connects.svg",
  transparency: "/optimizedIcons/medium/transparency.svg",
  simplicity: "/optimizedIcons/medium/simplicity.svg",
  fairness: "/optimizedIcons/medium/fairness.svg",
  "property-placeholder": "/optimizedIcons/medium/property-placeholder.svg",
  "property-placeholder-icon":
    "/optimizedIcons/medium/property-placeholder-icon.svg",
};

// Large icons configuration (external files, > 20KB)
const LARGE_ICONS = {
  "access-property-services":
    "/optimizedIcons/large/access-property-services.svg",
  bachelor: "/optimizedIcons/large/bachelor.svg",
  "coin-stack": "/optimizedIcons/large/coin-stack.svg",
  company: "/optimizedIcons/large/company.svg",
  "contact-support": "/optimizedIcons/large/contact-support.svg",
  couple: "/optimizedIcons/large/couple.svg",
  "customer-support": "/optimizedIcons/large/customer-support.svg",
  "direct-owner-connections":
    "/optimizedIcons/large/direct-owner-connections.svg",
  family: "/optimizedIcons/large/family.svg",
  "fast-results": "/optimizedIcons/large/fast-results.svg",
  "go-live": "/optimizedIcons/large/go-live.svg",
  "how-to-use-connects": "/optimizedIcons/large/how-to-use-connects.svg",
  "list-property-success": "/optimizedIcons/large/list-property-success.svg",
  "non-veg": "/optimizedIcons/large/non-veg.svg",
  "pay-as-you-go": "/optimizedIcons/large/pay-as-you-go.svg",
  "property-add-graphic": "/optimizedIcons/large/property-add-graphic.svg",
  "property-basics": "/optimizedIcons/large/property-basics.svg",
  "showcase-your-space": "/optimizedIcons/large/showcase-your-space.svg",
  "simplify-rental-processes":
    "/optimizedIcons/large/simplify-rental-processes.svg",
  veg: "/optimizedIcons/large/veg.svg",
  "what-are-connects": "/optimizedIcons/large/what-are-connects.svg",
  "why-choose-connects": "/optimizedIcons/large/why-choose-connects.svg",
  "not-found": "/optimizedIcons/large/not-found.svg",
  "how-to-use-connects-mobile":
    "/optimizedIcons/large/how-to-use-connects-mobile.svg",
};

// Default blur placeholder data URLs for different icon categories
const DEFAULT_BLUR_PLACEHOLDERS = {
  medium:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjI0IiBjeT0iMjQiIHI9IjEyIiBmaWxsPSIjRTVFN0VCIi8+Cjwvc3ZnPgo=",
  large:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNFNUU3RUIiLz4KPC9zdmc+Cg==",
};

// NocoJS-inspired blur effect component
const BlurPlaceholder = memo(
  ({
    size,
    className = "",
    customBlurData,
  }: {
    size: number | `${number}`;
    className?: string;
    customBlurData?: string;
  }) => {
    const numericSize = typeof size === "string" ? parseInt(size) : size;
    const blurData =
      customBlurData ||
      (numericSize > 100
        ? DEFAULT_BLUR_PLACEHOLDERS.large
        : DEFAULT_BLUR_PLACEHOLDERS.medium);

    return (
      <div
        className={`animate-pulse transition-opacity duration-300 ${className}`}
        style={{
          width: size,
          height: size,
          backgroundImage: `url("${blurData}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
          opacity: 0.7,
        }}
      />
    );
  },
);

BlurPlaceholder.displayName = "BlurPlaceholder";

// Determine icon size category
const getIconCategory = (name: string, explicitSize?: IconSize): IconSize => {
  if (explicitSize) return explicitSize;

  if (name in SMALL_ICONS) return "small";
  if (name in MEDIUM_ICONS) return "medium";
  if (name in LARGE_ICONS) return "large";

  return "small";
};

// Small icon component (inlined SVG)
const SmallIcon = memo(
  ({ name, size = 24, className = "", ...props }: IconProps) => {
    let svg = SMALL_ICONS[name as keyof typeof SMALL_ICONS];
    if (!svg) {
      console.warn(`Small icon "${name}" not found`);
      return null;
    }

    // Ensure width/height on <svg>
    svg = svg.replace(/<svg\b([^>]*)>/, (_m, attrs) => {
      const cleaned = attrs.replace(/\s(width|height)="[^"]*"/g, "");
      return `<svg ${cleaned} width="${size}" height="${size}">`;
    });

    return (
      <span
        className={`inline-flex items-center justify-center leading-none ${className} [&_svg]:block [&_svg]:w-full [&_svg]:h-full`}
        style={{ width: size, height: size, flexShrink: 0 }}
        {...props}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  },
);

SmallIcon.displayName = "SmallIcon";

// Medium icon component (lazy loaded with blur placeholder)
const MediumIcon = memo(
  ({
    name,
    size = 48,
    className = "",
    color: _color,
    showBlurPlaceholder = true,
    blurDataUrl,
    ...props
  }: IconProps) => {
    const iconPath = MEDIUM_ICONS[name as keyof typeof MEDIUM_ICONS];

    if (!iconPath) {
      console.warn(`Medium icon "${name}" not found`);
      return null;
    }

    const fallback = showBlurPlaceholder ? (
      <BlurPlaceholder
        size={size}
        className={className}
        customBlurData={blurDataUrl}
      />
    ) : (
      <div
        className={`animate-pulse bg-gray-200 rounded ${className}`}
        style={{ width: size, height: size }}
      />
    );

    return (
      <Suspense fallback={fallback}>
        <Image
          src={iconPath}
          alt={`${name} icon`}
          width={size}
          height={size}
          className={`object-contain ${className}`}
          loading="lazy"
          unoptimized
          {...props}
        />
      </Suspense>
    );
  },
);

MediumIcon.displayName = "MediumIcon";

// Large icon component (client-side loading with blur)
const LargeIcon = memo(
  ({
    name,
    size = 200,
    className = "",
    alt,
    showBlurPlaceholder = true,
    blurDataUrl,
    ...props
  }: IconProps & { alt?: string }) => {
    const iconPath = LARGE_ICONS[name as keyof typeof LARGE_ICONS];
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const numericSize = typeof size === "string" ? parseInt(size) : size;

    useEffect(() => {
      if (!iconPath) return;
      const img = new window.Image();
      imgRef.current = img;

      img.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
      };

      img.onerror = () => {
        setError(true);
        setIsLoading(false);
      };

      // Start loading
      // Images are cached by the browser with Cache-Control: public, max-age=31536000, immutable
      // (configured in next.config.ts headers)
      img.src = iconPath;

      return () => {
        if (imgRef.current) {
          imgRef.current.onload = null;
          imgRef.current.onerror = null;
        }
      };
    }, [iconPath]);

    if (!iconPath) {
      console.warn(`Large icon "${name}" not found`);
      return null;
    }

    if (error) {
      return (
        <div
          className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${className}`}
          style={{ width: size, height: size }}
        >
          <span className="text-gray-400 text-sm">Failed to load</span>
        </div>
      );
    }

    return (
      <div className="relative inline-block">
        {/* Blur placeholder */}
        {isLoading && showBlurPlaceholder && (
          <BlurPlaceholder
            size={size}
            className={className}
            customBlurData={blurDataUrl}
          />
        )}

        {/* Actual image */}
        <Image
          src={iconPath}
          alt={alt || `${name} icon`}
          width={numericSize}
          height={numericSize}
          className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${isLoading ? "absolute inset-0" : ""} ${className}`}
          loading="lazy"
          unoptimized
          {...props}
        />
      </div>
    );
  },
);

LargeIcon.displayName = "LargeIcon";

// Main SVG Icon wrapper component
const SvgIcon = memo(
  (
    props: IconProps & {
      iconSize?: IconSize;
      alt?: string;
    },
  ) => {
    const { name, iconSize, ...restProps } = props;
    const category = getIconCategory(name, iconSize);

    switch (category) {
      case "small":
        return <SmallIcon name={name} {...restProps} />;
      case "medium":
        return <MediumIcon name={name} {...restProps} />;
      case "large":
        return <LargeIcon name={name} {...restProps} />;
      default:
        console.warn(`Unknown icon category for "${name}"`);
        return null;
    }
  },
);

SvgIcon.displayName = "SvgIcon";

export default SvgIcon;

// Hook for preloading medium icons
export const usePreloadIcon = (name: string) => {
  useEffect(() => {
    const iconPath = MEDIUM_ICONS[name as keyof typeof MEDIUM_ICONS];
    if (iconPath) {
      // Preload the image
      const img = new window.Image();
      img.src = iconPath;
    }
  }, [name]);
};

// Hook for preloading large icons
export const usePreloadLargeIcon = (name: string) => {
  useEffect(() => {
    const iconPath = LARGE_ICONS[name as keyof typeof LARGE_ICONS];
    if (iconPath) {
      const img = new window.Image();
      img.src = iconPath;
    }
  }, [name]);
};

// Client-side blur data URL generator (NocoJS-inspired)
export const generateBlurPlaceholder = (
  width: number = 48,
  height: number = 48,
  backgroundColor: string = "#F3F4F6",
  accentColor: string = "#E5E7EB",
): string => {
  const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="${backgroundColor}"/>
        <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 4}" fill="${accentColor}"/>
      </svg>
    `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Utility to add new icons dynamically
export const addIcons = {
  small: (icons: Record<string, string>) => {
    Object.assign(SMALL_ICONS, icons);
  },
  medium: (icons: Record<string, MediumIconPath>) => {
    Object.assign(MEDIUM_ICONS, icons);
  },
  large: (icons: Record<string, string>) => {
    Object.assign(LARGE_ICONS, icons);
  },
};

// Client-side icon optimizer utility
export const optimizeSvgString = (svgString: string): string => {
  return svgString
    .replace(/\s+/g, " ") // Collapse whitespace
    .replace(/>\s+</g, "><") // Remove space between tags
    .replace(/\s*=\s*"/g, '="') // Clean up attribute spacing
    .trim();
};
