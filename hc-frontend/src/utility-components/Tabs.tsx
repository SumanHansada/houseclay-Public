"use client";

import React, {
  Children,
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useState,
} from "react";

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
  defaultActive?: string;
  onTabChange?: (value: string) => void;
  className?: string;
}

interface TabHeaderProps {
  children: ReactNode;
  containerClassName?: string;
  tabsClassName?: string;
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
}) => {
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

  return (
    <div
      className={`flex w-full items-center justify-between ${containerClassName}`}
    >
      <div className={`${tabsClassName}`}>{tabChildren}</div>
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

  const [active, setActive] = useState<string>(
    defaultActive || firstTabValue || "",
  );

  const handleTabClick = (value: string) => {
    setActive(value);
    if (onTabChange) onTabChange(value);
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
