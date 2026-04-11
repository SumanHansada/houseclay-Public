"use client";
import { motion, useReducedMotion } from "framer-motion";
import React, {
  Children,
  cloneElement,
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useState,
} from "react";

const tabTween = {
  type: "tween" as const,
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1] as const,
};

interface TabContextType {
  active: string;
  onTabClick: (value: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

interface TabProps {
  label: string;
  value: string;
  containerClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

interface TabContentProps {
  children: ReactNode;
  value: string;
  className?: string;
}

interface TabsProps {
  children: ReactNode;
  /** When set, the active tab is controlled by the parent (e.g. shared with other UI). */
  active?: string;
  defaultActive?: string;
  onTabChange?: (value: string) => void;
  className?: string;
}

interface TabHeaderProps {
  children: ReactNode;
  containerClassName?: string;
  tabsClassName?: string;
  /** Sliding pill indicator (equal-width segments), similar to segmented controls on mobile filters. */
  segmented?: boolean;
}

interface NonTabProps {
  children: ReactNode;
  className?: string;
}

const Tab: React.FC<TabProps> = ({
  label,
  value,
  containerClassName = "",
  activeClassName = "",
  inactiveClassName = "",
}) => {
  const context = useContext(TabContext);
  if (!context) throw new Error("Tab must be used within Tabs");
  const isActive = context.active === value;

  return (
    <button
      className={`transition-colors relative ${containerClassName}
        ${isActive ? activeClassName : inactiveClassName}
      `}
      onClick={() => context.onTabClick(value)}
      type="button"
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
};

const NonTab: React.FC<NonTabProps> = ({ children, className = "" }) => {
  // This is just a marker component for TabHeader to recognize
  return <div className={className}>{children}</div>;
};

const TabHeader: React.FC<TabHeaderProps> = ({
  children,
  containerClassName = "",
  tabsClassName = "",
  segmented = false,
}) => {
  const context = useContext(TabContext);
  const reduceMotion = useReducedMotion();

  // Separate Tab and NonTab children
  const tabChildren: ReactElement[] = [];
  const nonTabChildren: ReactElement[] = [];

  Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === Tab) {
      tabChildren.push(child);
    } else if (React.isValidElement(child) && child.type === NonTab) {
      nonTabChildren.push(child);
    }
  });

  const tabCount = tabChildren.length;
  const activeTabIndex =
    segmented && context
      ? Math.max(
          0,
          tabChildren.findIndex(
            (t) =>
              React.isValidElement<TabProps>(t) &&
              t.props.value === context.active,
          ),
        )
      : 0;

  const tabRow = segmented
    ? tabChildren.map((tab) => {
        if (!React.isValidElement<TabProps>(tab)) return tab;
        return cloneElement(tab, {
          containerClassName: `relative z-10 flex flex-1 items-center justify-center whitespace-nowrap rounded-lg ${tab.props.containerClassName ?? ""}`,
        });
      })
    : tabChildren;

  const segmentedInner = (
    <>
      {segmented && tabCount > 0 && context ? (
        <motion.div
          className="pointer-events-none absolute inset-y-0 left-0 z-0 rounded-lg border border-red-500 bg-white shadow-sm"
          initial={false}
          style={{
            width: `${100 / tabCount}%`,
          }}
          animate={{
            left: `${(activeTabIndex / tabCount) * 100}%`,
          }}
          transition={reduceMotion ? { duration: 0, ease: "linear" } : tabTween}
          aria-hidden
        />
      ) : null}
      {tabRow}
    </>
  );

  return (
    <div
      className={`flex w-full items-center justify-between ${containerClassName}`}
    >
      {segmented ? (
        <div className={tabsClassName}>
          <div className="relative flex min-h-10 sm:min-h-11">
            {segmentedInner}
          </div>
        </div>
      ) : (
        <div className={tabsClassName}>{tabRow}</div>
      )}
      <div className="flex gap-2 ml-auto">{nonTabChildren}</div>
    </div>
  );
};

const TabContent: React.FC<TabContentProps> = ({
  children,
  value,
  className = "",
}) => {
  const context = useContext(TabContext);
  if (!context) throw new Error("TabContent must be used within Tabs");
  if (context.active !== value) return null;
  return <div className={`py-4 max-md:py-2 ${className}`}>{children}</div>;
};

const Tabs: React.FC<TabsProps> = ({
  children,
  active: controlledActive,
  defaultActive,
  onTabChange,
  className = "",
}) => {
  // Find TabHeader and TabContent children
  let tabHeader: ReactElement | undefined;
  const tabContents: ReactElement[] = [];
  let firstTabValue: string | undefined;

  Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === TabHeader) {
      tabHeader = child;
      // Find first <Tab> value for defaultActive fallback
      const headerChildren = (child.props as { children?: ReactNode }).children;
      Children.forEach(headerChildren, (tabChild) => {
        if (
          React.isValidElement<{ value: string }>(tabChild) &&
          tabChild.type === Tab &&
          tabChild.props.value &&
          !firstTabValue
        ) {
          firstTabValue = tabChild.props.value;
        }
      });
    } else if (React.isValidElement(child) && child.type === TabContent) {
      tabContents.push(child);
    }
  });

  const [uncontrolledActive, setUncontrolledActive] = useState<string>(
    defaultActive ?? firstTabValue ?? "",
  );
  const isControlled = controlledActive !== undefined;
  const active = isControlled ? controlledActive : uncontrolledActive;

  const handleTabClick = (value: string) => {
    if (!isControlled) setUncontrolledActive(value);
    onTabChange?.(value);
  };

  return (
    <TabContext.Provider value={{ active, onTabClick: handleTabClick }}>
      <div className={`w-full ${className}`}>
        {tabHeader}
        {tabContents}
      </div>
    </TabContext.Provider>
  );
};

export { NonTab, Tab, TabContent, TabHeader, Tabs };
export default Tabs;
