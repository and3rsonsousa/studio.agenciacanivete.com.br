import Button from "~/components/Button";
import DatepickerField from "~/components/Forms/DatepickerField";
import Field from "~/components/Forms/InputField";

export default function Components() {
  return (
    <div className="container mx-auto max-w-2xl px-8">
      <div className="py-16">
        <h1>Componentes</h1>
      </div>

      <div>
        <div>
          <h3>Buttons</h3>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h4>Padrão</h4>
              <Code>.button</Code>
            </div>
            <div>
              <Button small type="submit">
                Fazer Login
              </Button>
            </div>
            <div>
              <Button>Fazer Login</Button>
            </div>
            <div>
              <Button large>Fazer Login</Button>
            </div>

            <div>
              <Button disabled>Fazer Login</Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4>Primário</h4>
              <Code>.button.button-primary</Code>
            </div>
            <div>
              <Button primary small>
                Fazer Login
              </Button>
            </div>
            <div>
              <Button primary>Fazer Login</Button>
            </div>
            <div>
              <Button primary large>
                Fazer Login
              </Button>
            </div>
            <div>
              <Button disabled primary>
                Fazer Login
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div>
          <h3>Forms</h3>
        </div>
        <div>
          <h4>Field</h4>
          <Code>
            {`<Field`}
            <br />
            name:string <br />
            label:string
            <br />
            type?:"text"|"email"|"datetime-local" <br />
            placeholder?:string <br />
            {`/>`}
          </Code>
        </div>
        <div>
          <Field name="teste" label="Text" />
          <DatepickerField name="" title="Data" />
        </div>
      </div>
      <div className="py-8 text-center text-xs font-bold tracking-widest ">
        @CNVT
      </div>
    </div>
  );
}

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="mt-4 block rounded bg-gray-600 p-4 font-bold text-gray-300 dark:bg-gray-800">
    {children}
  </code>
);
