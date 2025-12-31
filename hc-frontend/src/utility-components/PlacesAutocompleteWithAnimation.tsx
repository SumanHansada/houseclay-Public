"use client";

import { PlacesAutocomplete } from "@/base-components";
import withAnimatedPlaceholder from "@/hoc/withAnimatedPlaceholder";

const PlacesAutocompleteWithAnimation =
  withAnimatedPlaceholder(PlacesAutocomplete);

export default PlacesAutocompleteWithAnimation;
