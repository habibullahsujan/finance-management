import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$delete"]
>;

export const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.transactions[":id"].$delete({
        param: { id }
      });
      const result = await response.json();

      return result;
    },

    onSuccess: () => {
      toast.success("Transaction delete successfully!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      // TO-DO: invalidate summary
    },

    onError: () => {
      toast.error("Failed to delete transaction.");
    },
  });
  return mutation;
};
