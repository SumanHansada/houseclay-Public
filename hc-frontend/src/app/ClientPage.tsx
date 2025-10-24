"use client";

import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

import Advantages from "@/components/Advantages";
import Neighbourhoods from "@/components/Neighborhoods";
import PropertyOwners from "@/components/PropertyOwners";
import Standouts from "@/components/Standouts";
import { Testimonials } from "@/components/Testimonials";
import { LoginDialog, MenuDialog, StandoutsDialog } from "@/dialogs";
import { Neighbourhood } from "@/interfaces/Neighbourhood";
import { Testimonial } from "@/interfaces/Testimonial";
import { useDialog } from "@/providers/DialogContextProvider";
import {
  setHideFooter,
  setHideHeader,
  setHideStickyNavBar,
} from "@/store/appSlice";
import {
  usePopularNeighbourhoodsQuery,
  useStandoutsQuery,
} from "@/store/apiSlice";
import { PropertyCardWithImages } from "@/interfaces/User";
import { FALLBACK_IMG } from "@/common/constants";

interface ClientPageProps {
  // properties: PropertySearch[];
  // neighbourhoods: Neighbourhood[];
  testimonials: Testimonial[];
}

export default function ClientPage({
  // properties,
  // neighbourhoods,
  testimonials,
}: ClientPageProps) {
  const { isDialogOpen } = useDialog();
  const dispatch = useDispatch();

  const { data: neighbourhoodData } = usePopularNeighbourhoodsQuery(undefined, {
    refetchOnMountOrArgChange: 30,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  // console.log("neighbourhoodData", neighbourhoodData);

  const { data: standoutsData } = useStandoutsQuery(undefined, {
    refetchOnMountOrArgChange: 30,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  // console.log("standoutsData", standoutsData);

  const standoutProperties = useMemo(
    () => standoutsData ?? [],
    [standoutsData],
  );

  const standoutPropertyCards: PropertyCardWithImages[] = useMemo(() => {
    return standoutProperties.map((prop: PropertyCardWithImages) => ({
      ...prop,
      images: prop.image ? [prop.image] : [FALLBACK_IMG],
    }));
  }, [standoutProperties]);
  // console.log("Standout Property cards: ", standoutPropertyCards);

  // Initialize app state
  useEffect(() => {
    dispatch(setHideHeader(false));
    dispatch(setHideFooter(false));
    dispatch(setHideStickyNavBar(false));
  }, [dispatch]);

  return (
    <>
      {/* Advantages Section */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <Advantages />
      </section>

      {/* Standouts Section */}
      {standoutPropertyCards.length > 0 ? (
        <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
          <Standouts properties={standoutPropertyCards} />
        </section>
      ) : null}

      {/* neighbourhoods Section */}
      {/* TODO: only show this section if there are 4 or more than 4 popular neighbourhoods present */}
      {neighbourhoodData && neighbourhoodData.length > 3 ? (
        <section className="min-h-[500px] w-full overflow-hidden">
          <Neighbourhoods neighbourhoods={neighbourhoodData} />
        </section>
      ) : null}

      {/* Testimonials Section */}
      <section className="min-h-[500px] w-full overflow-hidden">
        <Testimonials testimonials={testimonials} />
      </section>

      {/* Property Owners Section */}
      <section className="min-h-[500px] w-full overflow-hidden max-md:hidden">
        <PropertyOwners />
      </section>

      {/* Standouts Dialog */}
      {/* TODO - need a toast message if there are no standout properties */}
      {isDialogOpen("standouts-dialog") && standoutPropertyCards.length > 0 && (
        <StandoutsDialog
          id="standouts-dialog"
          properties={standoutPropertyCards}
        />
      )}

      {/* Login Dialog */}
      {isDialogOpen("login-dialog") && <LoginDialog id="login-dialog" />}

      {/* Menu Dialog */}
      {isDialogOpen("menu-dialog") && <MenuDialog id="menu-dialog" />}
    </>
  );
}
