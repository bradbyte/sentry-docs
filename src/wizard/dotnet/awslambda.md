---
name: AWS Lambda (.NET)
doc_link: https://docs.sentry.io/platforms/dotnet/guides/aws-lambda/
support_level: production
type: framework
---

Sentry provides an integration with AWS Lambda ASP.NET Core Server through the [Sentry.AspNetCore NuGet package](https://www.nuget.org/packages/Sentry.AspNetCore).

## Install

Add the Sentry dependency:

```powershell {tabTitle:Package Manager}
Install-Package Sentry.AspNetCore -Version {{ packages.version('sentry.dotnet.aspnetcore') }}
```

```shell {tabTitle:.NET Core CLI}
dotnet add package Sentry.AspNetCore -v {{ packages.version('sentry.dotnet.aspnetcore') }}
```

You can combine this integration with a logging library like `log4net`, `NLog`, or `Serilog` to include both request data as well as your logs as breadcrumbs. The logging ingrations also capture events when an error is logged.

### Configuring

All `ASP.NET Core` configurations are valid here. But one configuration in particular is relevant.

`FlushOnCompletedRequest` ensures all events are flushed out. This is beacause the general ASP.NET Core hooks for when the process is exiting are not guaranteed to run in a serverless environment. This setting ensures that no event is lost if AWS recycles the process.

```csharp
public class LambdaEntryPoint : Amazon.Lambda.AspNetCoreServer.APIGatewayProxyFunction
{
    protected override void Init(IWebHostBuilder builder)
    {
        builder
            // Add Sentry
            .UseSentry(o =>
            {
              o.Dsn = "___PUBLIC_DSN___";
              // When configuring for the first time, to see what the SDK is doing:
              o.Debug = true;
              // Required in Serverless environments
              o.FlushOnCompletedRequest = true;
              // Set TracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
               // We recommend adjusting this value in production.
              o.TracesSampleRate = 1.0;
            })
            .UseStartup<Startup>();
    }
}
```

### Verification

You can verify your setup by throwing an exception from a function:

```csharp
[Route("api/[controller]")]
public class BadController
{
    [HttpGet]
    public string Get() => throw null;
}
```

And make a request to that lambda:

```shell
curl -X GET -I https://url.of.server.aws/api/bad
```

Check out the [Sentry ASP.NET Core](/platforms/dotnet/guides/aspnetcore/) documentation for the complete set of options.
