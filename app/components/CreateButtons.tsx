import {
  DocumentPlusIcon,
  FolderPlusIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useOutletContext } from "@remix-run/react";
import { ContextType } from "~/lib/models";
import Button from "./Button";

export default function CreateButtons({
  celebration,
  campaign,
  action,
  showSmallAction,
}: {
  celebration?: boolean;
  campaign?: boolean;
  action?: boolean;
  showSmallAction?: boolean;
}) {
  const context: ContextType = useOutletContext();

  return (
    <div className="flex items-center justify-end gap-2 p-4 ">
      {/* Dialog for Celebrations */}
      {celebration && !showSmallAction && (
        <div>
          <Button
            link
            icon
            squared
            onClick={() => {
              context.celebrations.setOpen(true);
            }}
          >
            <StarIcon />
          </Button>
        </div>
      )}
      {campaign && !showSmallAction && (
        <div>
          <Button
            link
            icon
            squared
            onClick={() => {
              context.campaigns.setOpen(true);
            }}
          >
            <FolderPlusIcon />
          </Button>
        </div>
      )}
      {action && (
        <div
          className={`${
            showSmallAction ? "fixed right-4 bottom-4 z-10" : "ml-4"
          } `}
        >
          <Button
            primary
            icon
            squared={showSmallAction}
            large={showSmallAction}
            onClick={() => {
              context.actions.setOpen(true);
            }}
            title="Cmd + Shift + K"
          >
            {!showSmallAction && (
              <div className="whitespace-nowrap">Nova Ação</div>
            )}
            <DocumentPlusIcon />
          </Button>
        </div>
      )}
    </div>
  );
}
