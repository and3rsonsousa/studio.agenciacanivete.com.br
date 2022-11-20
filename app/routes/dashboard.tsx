import type { LoaderFunction } from "@remix-run/cloudflare";
import { Outlet, useOutletContext } from "@remix-run/react";
import Layout from "~/components/Layout";
import { getUser } from "~/lib/auth.server";
import {
  getAccounts,
  getCelebrations,
  getPersonByUser,
  getPersons,
  getTagsStatus,
} from "~/lib/data";

export const loader: LoaderFunction = async ({ request }) => {
  const { data } = await getUser(request);

  const userId = data.session.user.id;

  const [
    { data: person },
    { data: persons },
    { data: accounts },
    { tags, status },
    { data: celebrations },
  ] = await Promise.all([
    getPersonByUser(userId, request),
    getPersons(request),
    getAccounts(userId, request),
    getTagsStatus(request),
    getCelebrations({ request }),
  ]);

  const url = request.url;

  return { person, persons, accounts, tags, status, celebrations, url };
};

export default function Dashboard() {
  const context = useOutletContext();
  return (
    <Layout>
      <Outlet context={context} />
    </Layout>
  );
}
