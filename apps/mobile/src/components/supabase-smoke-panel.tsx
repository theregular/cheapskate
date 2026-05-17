import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  type TextStyle,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
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

  const inputStyle = useMemo<TextStyle>(
    () => ({
      color: theme.text,
      borderColor: theme.backgroundSelected,
      backgroundColor: theme.background,
    }),
    [theme]
  );

  const buttonStyle = useMemo(
    () => [
      styles.button,
      { backgroundColor: theme.text, opacity: loadingAction || !hasSupabaseEnv ? 0.55 : 1 },
    ],
    [loadingAction, theme.text]
  );

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
    <ThemedView type="backgroundElement" style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <ThemedText type="smallBold">Local Supabase</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {hasSupabaseEnv ? supabaseUrl : 'Missing Expo public env vars'}
          </ThemedText>
        </View>
        {loadingAction && <ActivityIndicator color={theme.text} />}
      </View>

      <View style={styles.fields}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loadingAction}
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, inputStyle]}
          value={email}
        />
        <TextInput
          autoCapitalize="none"
          editable={!loadingAction}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
          style={[styles.input, inputStyle]}
          value={password}
        />
      </View>

      <View style={styles.actions}>
        <Pressable disabled={disabled} onPress={signUp} style={buttonStyle}>
          <ThemedText type="smallBold" style={[styles.buttonText, { color: theme.background }]}>
            Sign up
          </ThemedText>
        </Pressable>
        <Pressable disabled={disabled} onPress={signIn} style={buttonStyle}>
          <ThemedText type="smallBold" style={[styles.buttonText, { color: theme.background }]}>
            Sign in
          </ThemedText>
        </Pressable>
        <Pressable disabled={disabled || !userEmail} onPress={signOut} style={buttonStyle}>
          <ThemedText type="smallBold" style={[styles.buttonText, { color: theme.background }]}>
            Sign out
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Pressable disabled={disabled || !userEmail} onPress={writeRow} style={buttonStyle}>
          <ThemedText type="smallBold" style={[styles.buttonText, { color: theme.background }]}>
            Write row
          </ThemedText>
        </Pressable>
        <Pressable disabled={disabled || !userEmail} onPress={refreshRows} style={buttonStyle}>
          <ThemedText type="smallBold" style={[styles.buttonText, { color: theme.background }]}>
            Refresh rows
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.status}>
        <ThemedText type="small" themeColor={error ? undefined : 'textSecondary'}>
          {error ?? status}
        </ThemedText>
        {userEmail && (
          <ThemedText type="small" themeColor="textSecondary">
            Session: {userEmail}
          </ThemedText>
        )}
      </View>

      <View style={styles.rows}>
        {rows.map((row) => (
          <View key={row.id} style={[styles.row, { borderColor: theme.backgroundSelected }]}>
            <ThemedText type="smallBold">{row.label}</ThemedText>
            <ThemedText type="code" themeColor="textSecondary">
              {new Date(row.created_at).toLocaleString()}
            </ThemedText>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  panel: {
    alignSelf: 'stretch',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  headerText: {
    flex: 1,
    gap: Spacing.one,
  },
  fields: {
    gap: Spacing.two,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  button: {
    minHeight: 40,
    minWidth: 104,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  buttonText: {
    textAlign: 'center',
  },
  status: {
    gap: Spacing.one,
  },
  rows: {
    gap: Spacing.two,
  },
  row: {
    gap: Spacing.one,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.two,
  },
});
