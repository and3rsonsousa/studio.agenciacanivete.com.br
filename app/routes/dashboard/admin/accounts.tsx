import { LockClosedIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { getUser } from "~/lib/auth.server";
import { getAccounts, getPersonByUser, handleAction } from "~/lib/data";
import type { AccountModel } from "~/lib/models";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  return await handleAction(formData, request);
};

export const loader: LoaderFunction = async ({ request }) => {
  const {
    data: { session },
    response,
  } = await getUser(request);

  if (session === null) {
    throw redirect(`/login`, { headers: response.headers });
  }
  const { data: person } = await getPersonByUser(session.user.id, request);

  if (!person.admin) {
    return redirect("/dashboard");
  }

  const { data: accounts } = await getAccounts(session.user.id, request);

  return { accounts };
};

export default function Accounts() {
  const { accounts } = useLoaderData<{ accounts: AccountModel[] }>();
  return (
    <div className="flex h-screen flex-col">
      <div className="flex justify-between border-b p-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <LockClosedIcon className="w-6" />

          <Link to={`/dashboard/admin/accounts`}>
            <h2 className="mb-0 dark:text-gray-200">Clientes</h2>
          </Link>
        </div>
      </div>
      <div className="flex h-full overflow-hidden">
        <div className="no-scrollbars w-24 max-w-md divide-y overflow-hidden overflow-y-auto dark:divide-gray-800 md:w-1/3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="group flex  items-center justify-between"
            >
              <Link
                to={`/dashboard/admin/accounts/${account.slug}`}
                // className="block w-full p-4 font-medium focus:text-brand focus:outline-none md:px-8"
                className="dropdown-item w-full"
              >
                <span className="hidden md:block">{account.name}</span>
                <span className="block w-full text-center uppercase md:hidden">
                  {account.name.slice(0, 3)}
                </span>
              </Link>
              <div className="hidden pr-2 opacity-0 group-hover:opacity-100 md:block">
                <Form method="post">
                  <input type="hidden" name="action" value="delete-account" />
                  <input type="hidden" name="id" value={account.id} />
                  <Link
                    tabIndex={-1}
                    to={`./${account.slug}/delete`}
                    className="button button-link button-small button-squared"
                  >
                    <TrashIcon />
                  </Link>
                </Form>
              </div>
            </div>
          ))}
        </div>

        <Outlet />
      </div>
    </div>
  );
}
