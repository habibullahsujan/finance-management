import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts["bulk-delete"]["$post"]({
        json,
      });
      const result = await response.json();
      return result;
    },

    onSuccess: () => {
      toast.success("Accounts deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      // TO-DO: invalidate summary
    },

    onError: () => {
      toast.error("Failed to delete accounts.");
    },
  });
  return mutation;
};
