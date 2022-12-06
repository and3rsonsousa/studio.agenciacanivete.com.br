import { LockClosedIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import Button from "~/components/Button";
import { getUser } from "~/lib/auth.server";
import { getPersonByUser, getPersons, handleAction } from "~/lib/data";
import type { PersonModel } from "~/lib/models";

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

  const { data: persons } = await getPersons(request);

  return { persons };
};

export default function Users() {
  const { persons } = useLoaderData<{ persons: PersonModel[] }>();
  return (
    <div className="flex h-screen flex-col">
      <div className="flex justify-between border-b p-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <LockClosedIcon className="w-6" />

          <Link to={`/dashboard/admin/users`}>
            <h2 className="mb-0 dark:text-gray-200">Usuários</h2>
          </Link>
        </div>
      </div>
      <div className="flex h-full overflow-hidden">
        <div className="no-scrollbars w-1/2 max-w-md divide-y overflow-hidden overflow-y-auto dark:divide-gray-800">
          {persons.map((person) => (
            <div
              key={person.id}
              className="group flex items-center justify-between"
            >
              <Link
                to={`/dashboard/admin/users/${person.id}`}
                className="block py-4 px-8  font-medium focus:text-brand focus:outline-none"
              >
                {person.name}
              </Link>
              <div className="pr-2 opacity-0 group-hover:opacity-100">
                <Form method="post">
                  <input type="hidden" name="action" value="delete-person" />
                  <input type="hidden" name="id" value={person.id} />
                  <Button
                    small
                    link
                    onClick={(event) => {
                      if (
                        !window.confirm(
                          `Deseja mesmo deletar o usuário "${person.name}"`
                        )
                      ) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <TrashIcon />
                  </Button>
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
