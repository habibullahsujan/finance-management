import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.categories)[":id"]["$delete"]
>;

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.categories[":id"].$delete({
        param: { id }
      });
      const result = await response.json();

      return result;
    },

    onSuccess: () => {
      toast.success("Categories delete successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      // TO-DO: invalidate summary
    },

    onError: () => {
      toast.error("Failed to delete account.");
    },
  });
  return mutation;
};
