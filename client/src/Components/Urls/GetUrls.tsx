import { getUrls, getUrlVisits } from "@/services/url";
import type { Url } from "@/types/url";
import { Link } from "react-router-dom";
import {
  Link as URL,
  Settings,
  Info,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Plus,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Copy from "../Utils/Copy";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useSortableData } from "@/hooks/useSortableData";
import CreateShortUrl from "./CreateShortUrl";
import { useState } from "react";
import Delete from "../Utils/Delete";
import Share from "../Utils/Share";
import { Skeleton } from "../ui/skeleton";
import { NoData } from "@/assets/illustrations/NoData";
import { Button } from "../ui/button";

const GetUrls = () => {
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    url?: Url | null;
  }>({
    isOpen: false,
    url: null,
  });

  const queryClient = useQueryClient();

  const {
    data: urls = [],
    isLoading,
    error,
  } = useQuery<Url[]>({
    queryKey: ["urls"],
    queryFn: getUrls,
    refetchInterval: 5000,
    staleTime: 5000,
  });

  const { items, requestSort, getSortIndicator } = useSortableData(urls);

  const renderSortIcon = (key: string) => {
    const sortState = getSortIndicator(key);
    switch (sortState) {
      case "ascending":
        return <ChevronUp size={12} />;
      case "descending":
        return <ChevronDown size={12} />;
      default:
        return <ChevronsUpDown size={12} />;
    }
  };

  const handleMouseEnter = (urlId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["visits", urlId],
      queryFn: () => getUrlVisits(urlId),
      staleTime: 1000 * 60 * 5,
    });
  };

  const formatDate = (date) => {
    return new Date(date)
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .replace(",", "");
  };

  const PageLoading = () => {
    return (
      <div>
        {[...Array(5)].map((_, i) => (
          <div
            className="bg-background text-xs text-foreground border-t table-grid"
            key={i}
          >
            <div className="flex items-center px-4 py-4 gap-2">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center px-4 py-4">
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="px-4 py-4 flex items-center justify-center">
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="px-4 py-4 flex items-center justify-center">
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="px-4 py-4 flex items-center justify-center">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center justify-center px-4 py-4 gap-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-8 h-full w-full mt-4">
      {/* Table Header */}
      {urls.length != 0 ? (
        <div className=" py-2 text-foreground mt-4 flex justify-between">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center text-lg font-medium">
              URLs{" "}
              <span>
                <URL size={20} />
              </span>
            </div>
          </div>
          <CreateShortUrl text="Create" />
        </div>
      ) : null}
      {/* Table Rows */}

      <div className="mt-4 rounded-lg overflow-hidden h-full">
        {urls.length > 0 && (
          <div className="table-grid bg-background text-secondary-foreground  text-sm font-light">
            <div className="px-4 py-3">Short URL</div>
            <div className="px-4 py-3">Original URL</div>
            <div className="px-4 py-3 flex items-center justify-center gap-1">
              <p>Analytics</p>
              <Tooltip>
                <TooltipTrigger className="h-full mt-0.5">
                  <Info size={12} strokeWidth={1} />
                </TooltipTrigger>
                <TooltipContent className="border text-xs">
                  To enable analytics, go to the URL settings and verify your
                  website ownership.
                </TooltipContent>
              </Tooltip>
            </div>
            <div
              className="px-4 py-3 whitespace-nowrap flex items-center justify-center gap-1"
              onClick={() => requestSort("_count.visits")}
            >
              Visits
              {renderSortIcon("_count.visits")}
            </div>
            <div
              className="px-4 py-3 whitespace-nowrap flex items-center justify-center gap-1"
              onClick={() => requestSort("createdAt")}
            >
              Date <span>{renderSortIcon("createdAt")}</span>
            </div>
            <div className="px-4 py-3 whitespace-nowrap flex items-center justify-center"></div>
          </div>
        )}
        {urls.length == 0 && !isLoading && (
          <div className="w-full h-full min-h-[300px] flex flex-col justify-center items-center gap-2">
            <p className="text-muted-foreground font-bold">Nothing here yet!</p>
            <NoData />
            <div className="flex flex-col justify-center items-center mt-4 gap-2">
              <p className="text-muted-foreground text-sm">
                Create your first short link!
              </p>
              <CreateShortUrl text="Create" />
            </div>
          </div>
        )}
        {isLoading && <PageLoading />}
        {error && <div>Error</div>}
        {urls && (
          <div className="">
            {items.map((url) => (
              <div
                className=" bg-background text-xs text-foreground border-t table-grid"
                key={url.id}
              >
                <div className="flex items-center px-4 py-4 gap-2">
                  <Link
                    to={url.shortLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {url.shortLink}
                  </Link>
                  <div className="flex items-center">
                    <Copy url={url.shortLink} />
                  </div>
                </div>

                <div className="flex items-center px-4 py-4">
                  <Link
                    to={url.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {url.originalUrl}
                  </Link>
                </div>

                <div className=" px-4 py-4 flex items-center justify-center">
                  <Link
                    to={`/visit/${url.id}`}
                    key={url.shortLink}
                    onMouseEnter={() => handleMouseEnter(url.id)}
                    className="hover:text-secondary-foreground transition-all duration-200"
                  >
                    {" "}
                    View
                  </Link>
                </div>

                <div className="px-4 py-4 flex items-center justify-center">
                  <p>{url._count.visits}</p>
                </div>

                <div className="px-4 py-4 flex items-center justify-center">
                  <p>{formatDate(url.createdAt)}</p>
                </div>

                <div className="flex items-center justify-center px-4 py-4 gap-4">
                  <button className="cursor-pointer">
                    <Settings
                      size={20}
                      strokeWidth={1}
                      className="hover:rotate-45 transition-transform duration-300"
                    />
                  </button>
                  {/* <button
                    onClick={() => handleDeleteClick(url)}
                    className="p-1 cursor-pointer justify-between hover:text-red-400"
                  >
                    <Trash size={20} strokeWidth={1} />
                  </button> */}
                  <Delete
                    url={url}
                    deleteDialog={dialog}
                    setDeleteDialog={setDialog}
                  />
                  <Share value={url.shortLink} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default GetUrls;
