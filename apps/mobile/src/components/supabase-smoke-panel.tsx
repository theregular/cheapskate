import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { hasSupabaseEnv, supabase, supabaseUrl } from '@/lib/supabase';

type SmokeTestRow = {
  id: number;
  label: string;
  created_at: string;
};

const DEFAULT_EMAIL = 'local-smoke@example.com';
const DEFAULT_PASSWORD = 'local-smoke-password';

export function SupabaseSmokePanel() {
  const theme = useTheme();
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [rows, setRows] = useState<SmokeTestRow[]>([]);
  const [status, setStatus] = useState('Set Expo Supabase env vars, then sign in.');
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const refreshRows = useCallback(async () => {
    if (!hasSupabaseEnv) {
      setError('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY.');
      return;
    }

    setLoadingAction('refresh');
    setError(null);

    const { data, error: rowsError } = await supabase
      .from('smoke_tests')
      .select('id, label, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (rowsError) {
      setError(rowsError.message);
    } else {
      setRows(data ?? []);
      setStatus(`Loaded ${data?.length ?? 0} row${data?.length === 1 ? '' : 's'}.`);
    }

    setLoadingAction(null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const sessionEmail = data.session?.user.email ?? null;
      setUserEmail(sessionEmail);
      if (sessionEmail) {
        setStatus(`Signed in as ${sessionEmail}.`);
        refreshRows();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionEmail = session?.user.email ?? null;
      setUserEmail(sessionEmail);
      setStatus(sessionEmail ? `Signed in as ${sessionEmail}.` : 'Signed out.');
      if (sessionEmail) {
        refreshRows();
      } else {
        setRows([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshRows]);

  async function signUp() {
    if (!hasSupabaseEnv) {
      setError('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY.');
      return;
    }

    setLoadingAction('sign-up');
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setStatus('Signed up. If the user already exists, use Sign in.');
    }

    setLoadingAction(null);
  }

  async function signIn() {
    if (!hasSupabaseEnv) {
      setError('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY.');
      return;
    }

    setLoadingAction('sign-in');
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
    }

    setLoadingAction(null);
  }

  async function signOut() {
    setLoadingAction('sign-out');
    setError(null);

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
    }

    setLoadingAction(null);
  }

  async function writeRow() {
    if (!hasSupabaseEnv) {
      setError('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY.');
      return;
    }

    setLoadingAction('write');
    setError(null);

    const label = `phone smoke ${new Date().toLocaleTimeString()}`;
    const { error: insertError } = await supabase.from('smoke_tests').insert({ label });

    if (insertError) {
      setError(insertError.message);
    } else {
      setStatus(`Inserted "${label}".`);
      await refreshRows();
    }

    setLoadingAction(null);
  }

  const disabled = Boolean(loadingAction) || !hasSupabaseEnv;

  return (
    <Card className="w-full">
      <CardHeader className="flex-row justify-between gap-4">
        <View className="flex-1 gap-1">
          <CardTitle>Local Supabase</CardTitle>
          <CardDescription selectable>
            {hasSupabaseEnv ? supabaseUrl : 'Missing Expo public env vars'}
          </CardDescription>
        </View>
        {loadingAction && <ActivityIndicator color={theme.text} />}
      </CardHeader>

      <CardContent className="gap-4">
        <View className="gap-2">
          <Input
            aria-label="Email"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loadingAction}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email"
            value={email}
          />
          <Input
            aria-label="Password"
            autoCapitalize="none"
            editable={!loadingAction}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            value={password}
          />
        </View>

        <View className="flex-row flex-wrap gap-2">
          <Button className="min-w-[104px]" disabled={disabled} onPress={signUp} size="sm">
            <Text>Sign up</Text>
          </Button>
          <Button
            className="min-w-[104px]"
            disabled={disabled}
            onPress={signIn}
            size="sm">
            <Text>Sign in</Text>
          </Button>
          <Button
            className="min-w-[104px]"
            disabled={disabled || !userEmail}
            onPress={signOut}
            size="sm"
            variant="outline">
            <Text>Sign out</Text>
          </Button>
        </View>

        <View className="gap-1">
          <Text className={error ? 'text-destructive' : undefined} selectable variant="muted">
            {error ?? status}
          </Text>
          {userEmail && (
            <Text selectable variant="muted">
              Session: {userEmail}
            </Text>
          )}
        </View>

        <View className="gap-2">
          {rows.map((row) => (
            <View className="border-border gap-1 border-t pt-2" key={row.id}>
              <Text selectable variant="small">
                {row.label}
              </Text>
              <Text selectable variant="code">
                {new Date(row.created_at).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </CardContent>

      <CardFooter className="flex-wrap gap-2">
        <Button
          className="min-w-[104px]"
          disabled={disabled || !userEmail}
          onPress={writeRow}
          size="sm">
          <Text>Write row</Text>
        </Button>
        <Button
          className="min-w-[104px]"
          disabled={disabled || !userEmail}
          onPress={refreshRows}
          size="sm"
          variant="outline">
          <Text>Refresh rows</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
